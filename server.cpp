#include <iostream>
#include <fstream>
#include <string>
#include <map>
#include <vector>
#include <httplib.h>
#include <nlohmann/json.hpp>
#include "security_core.hpp"

using json = nlohmann::json;
using namespace httplib;
using namespace TimetableSecurity;

// ==================== CONFIGURATION ====================

struct ServerConfig {
    std::string host = "0.0.0.0";
    int port = 8080;
    std::string jwtSecret = "YOUR_SUPER_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION";
    std::string dataPath = "./data/";
    bool enableCORS = true;
    bool enableHTTPS = false;
    std::string certPath = "";
    std::string keyPath = "";
};

// ==================== DATABASE MANAGER ====================

class DatabaseManager {
private:
    std::string dataPath;
    CryptoManager crypto;

public:
    DatabaseManager(const std::string& path) : dataPath(path) {}

    json loadTimetableData() {
        std::ifstream file(dataPath + "timetable.json");
        if (!file.is_open()) {
            return json::object();
        }
        
        json data;
        file >> data;
        file.close();
        return data;
    }

    bool saveTimetableData(const json& data) {
        std::ofstream file(dataPath + "timetable.json");
        if (!file.is_open()) {
            return false;
        }
        
        file << data.dump(4);
        file.close();
        
        // Create backup
        std::ofstream backup(dataPath + "timetable_backup_" + 
                           std::to_string(std::time(nullptr)) + ".json");
        backup << data.dump(4);
        backup.close();
        
        return true;
    }

    json loadTeacherData() {
        std::ifstream file(dataPath + "teachers.json");
        if (!file.is_open()) {
            return json::array();
        }
        
        json data;
        file >> data;
        file.close();
        return data;
    }

    bool saveTeacherData(const json& data) {
        std::ofstream file(dataPath + "teachers.json");
        if (!file.is_open()) {
            return false;
        }
        
        file << data.dump(4);
        file.close();
        return true;
    }

    json loadUserData() {
        std::ifstream file(dataPath + "users.json");
        if (!file.is_open()) {
            // Create default admin user
            json defaultUser = {
                {"username", "admin"},
                {"passwordHash", crypto.hashPassword("boysun2026", "default_salt")},
                {"salt", "default_salt"},
                {"role", "admin"},
                {"createdAt", std::time(nullptr)}
            };
            
            json users = json::array();
            users.push_back(defaultUser);
            
            std::ofstream newFile(dataPath + "users.json");
            newFile << users.dump(4);
            newFile.close();
            
            return users;
        }
        
        json data;
        file >> data;
        file.close();
        return data;
    }
};

// ==================== REQUEST HANDLER ====================

class TimetableServer {
private:
    Server server;
    ServerConfig config;
    DatabaseManager db;
    SessionManager sessionMgr;
    RateLimiter rateLimiter;
    AuditLogger auditLog;
    JWTManager jwtMgr;
    CryptoManager crypto;

public:
    TimetableServer(const ServerConfig& cfg) 
        : config(cfg), db(cfg.dataPath), jwtMgr(cfg.jwtSecret) {
        setupRoutes();
        setupMiddleware();
    }

    void setupMiddleware() {
        // CORS middleware
        if (config.enableCORS) {
            server.set_pre_routing_handler([](const Request& req, Response& res) {
                res.set_header("Access-Control-Allow-Origin", "*");
                res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
                
                if (req.method == "OPTIONS") {
                    res.status = 200;
                    return Server::HandlerResponse::Handled;
                }
                return Server::HandlerResponse::Unhandled;
            });
        }

        // Security headers
        server.set_post_routing_handler([](const Request&, Response& res) {
            res.set_header("X-Content-Type-Options", "nosniff");
            res.set_header("X-Frame-Options", "DENY");
            res.set_header("X-XSS-Protection", "1; mode=block");
            res.set_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            res.set_header("Content-Security-Policy", "default-src 'self'");
        });
    }

    void setupRoutes() {
        // ==================== AUTHENTICATION ====================
        
        server.Post("/api/auth/login", [this](const Request& req, Response& res) {
            // Rate limiting
            std::string clientIp = req.get_header_value("X-Real-IP");
            if (clientIp.empty()) clientIp = req.remote_addr;
            
            if (!rateLimiter.checkRateLimit(clientIp)) {
                res.status = 429;
                res.set_content("{\"error\":\"Too many requests\"}", "application/json");
                return;
            }

            try {
                json reqData = json::parse(req.body);
                
                std::string username = reqData["username"];
                std::string password = reqData["password"];
                
                // Validate input
                if (!InputValidator::isValidUsername(username)) {
                    res.status = 400;
                    res.set_content("{\"error\":\"Invalid username\"}", "application/json");
                    return;
                }

                // Load users
                json users = db.loadUserData();
                
                // Find user
                bool authenticated = false;
                std::string userRole;
                
                for (const auto& user : users) {
                    if (user["username"] == username) {
                        std::string salt = user["salt"];
                        std::string storedHash = user["passwordHash"];
                        std::string inputHash = crypto.hashPassword(password, salt);
                        
                        if (inputHash == storedHash) {
                            authenticated = true;
                            userRole = user["role"];
                            break;
                        }
                    }
                }

                if (authenticated) {
                    // Generate JWT token
                    std::string token = jwtMgr.generateToken(username, userRole);
                    
                    // Create session
                    std::string userAgent = req.get_header_value("User-Agent");
                    std::string sessionId = sessionMgr.createSession(username, clientIp, userAgent);
                    
                    // Audit log
                    auditLog.log(username, "LOGIN", clientIp, "Successful login", true);
                    
                    json response = {
                        {"success", true},
                        {"token", token},
                        {"sessionId", sessionId},
                        {"user", {
                            {"username", username},
                            {"role", userRole}
                        }}
                    };
                    
                    res.set_content(response.dump(), "application/json");
                } else {
                    auditLog.log(username, "LOGIN_FAILED", clientIp, "Invalid credentials", false);
                    
                    res.status = 401;
                    res.set_content("{\"error\":\"Invalid credentials\"}", "application/json");
                }
            } catch (const std::exception& e) {
                res.status = 400;
                res.set_content("{\"error\":\"Invalid request\"}", "application/json");
            }
        });

        // ==================== TIMETABLE OPERATIONS ====================
        
        server.Get("/api/timetable", [this](const Request& req, Response& res) {
            if (!validateRequest(req, res)) return;
            
            json data = db.loadTimetableData();
            res.set_content(data.dump(), "application/json");
        });

        server.Post("/api/timetable", [this](const Request& req, Response& res) {
            if (!validateRequest(req, res, true)) return;
            
            try {
                json reqData = json::parse(req.body);
                
                // Validate JSON structure
                if (!InputValidator::isValidJSON(req.body)) {
                    res.status = 400;
                    res.set_content("{\"error\":\"Invalid JSON\"}", "application/json");
                    return;
                }

                // Save data
                if (db.saveTimetableData(reqData)) {
                    std::string userId = req.get_header_value("X-User-ID");
                    std::string clientIp = req.remote_addr;
                    auditLog.log(userId, "UPDATE_TIMETABLE", clientIp, "Timetable updated", true);
                    
                    res.set_content("{\"success\":true}", "application/json");
                } else {
                    res.status = 500;
                    res.set_content("{\"error\":\"Failed to save data\"}", "application/json");
                }
            } catch (const std::exception& e) {
                res.status = 400;
                res.set_content("{\"error\":\"Invalid request\"}", "application/json");
            }
        });

        // ==================== TEACHER OPERATIONS ====================
        
        server.Get("/api/teachers", [this](const Request& req, Response& res) {
            if (!validateRequest(req, res)) return;
            
            json data = db.loadTeacherData();
            res.set_content(data.dump(), "application/json");
        });

        server.Post("/api/teachers", [this](const Request& req, Response& res) {
            if (!validateRequest(req, res, true)) return;
            
            try {
                json reqData = json::parse(req.body);
                
                if (db.saveTeacherData(reqData)) {
                    std::string userId = req.get_header_value("X-User-ID");
                    std::string clientIp = req.remote_addr;
                    auditLog.log(userId, "UPDATE_TEACHERS", clientIp, "Teacher data updated", true);
                    
                    res.set_content("{\"success\":true}", "application/json");
                } else {
                    res.status = 500;
                    res.set_content("{\"error\":\"Failed to save data\"}", "application/json");
                }
            } catch (const std::exception& e) {
                res.status = 400;
                res.set_content("{\"error\":\"Invalid request\"}", "application/json");
            }
        });

        // ==================== SESSION MANAGEMENT ====================
        
        server.Post("/api/auth/logout", [this](const Request& req, Response& res) {
            std::string sessionId = req.get_header_value("X-Session-ID");
            sessionMgr.invalidateSession(sessionId);
            
            res.set_content("{\"success\":true}", "application/json");
        });

        server.Get("/api/auth/validate", [this](const Request& req, Response& res) {
            if (validateRequest(req, res)) {
                res.set_content("{\"valid\":true}", "application/json");
            }
        });
    }

    bool validateRequest(const Request& req, Response& res, bool requireAdmin = false) {
        // Get token from Authorization header
        std::string authHeader = req.get_header_value("Authorization");
        if (authHeader.empty() || authHeader.substr(0, 7) != "Bearer ") {
            res.status = 401;
            res.set_content("{\"error\":\"Unauthorized\"}", "application/json");
            return false;
        }

        std::string token = authHeader.substr(7);
        std::string userId, role;
        
        if (!jwtMgr.validateToken(token, userId, role)) {
            res.status = 401;
            res.set_content("{\"error\":\"Invalid token\"}", "application/json");
            return false;
        }

        // Check admin role if required
        if (requireAdmin && role != "admin") {
            res.status = 403;
            res.set_content("{\"error\":\"Forbidden\"}", "application/json");
            return false;
        }

        // Validate session
        std::string sessionId = req.get_header_value("X-Session-ID");
        std::string clientIp = req.remote_addr;
        std::string userAgent = req.get_header_value("User-Agent");
        
        if (!sessionMgr.validateSession(sessionId, clientIp, userAgent)) {
            res.status = 401;
            res.set_content("{\"error\":\"Invalid session\"}", "application/json");
            return false;
        }

        return true;
    }

    void start() {
        std::cout << "🔒 Secure Timetable Server Starting..." << std::endl;
        std::cout << "📍 Host: " << config.host << std::endl;
        std::cout << "🔌 Port: " << config.port << std::endl;
        std::cout << "🛡️  Security: ENABLED" << std::endl;
        std::cout << "✅ Server is running!" << std::endl;
        
        server.listen(config.host.c_str(), config.port);
    }

    void stop() {
        server.stop();
    }
};

// ==================== MAIN ====================

int main() {
    ServerConfig config;
    config.host = "0.0.0.0";
    config.port = 8080;
    config.dataPath = "./data/";
    
    // Create data directory if not exists
    system("mkdir -p ./data");
    
    TimetableServer server(config);
    server.start();
    
    return 0;
}
