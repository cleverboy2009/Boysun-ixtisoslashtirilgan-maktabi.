#ifndef SECURITY_CORE_HPP
#define SECURITY_CORE_HPP

#include <string>
#include <vector>
#include <map>
#include <chrono>
#include <random>
#include <openssl/sha.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <jwt-cpp/jwt.h>

namespace TimetableSecurity {

// ==================== ENCRYPTION & HASHING ====================

class CryptoManager {
private:
    static constexpr size_t SALT_SIZE = 32;
    static constexpr size_t KEY_SIZE = 32;
    static constexpr int PBKDF2_ITERATIONS = 100000;

    std::string generateSalt() {
        unsigned char salt[SALT_SIZE];
        RAND_bytes(salt, SALT_SIZE);
        return std::string(reinterpret_cast<char*>(salt), SALT_SIZE);
    }

public:
    // SHA-256 hash with salt
    std::string hashPassword(const std::string& password, const std::string& salt) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        std::string saltedPassword = password + salt;
        
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, saltedPassword.c_str(), saltedPassword.length());
        SHA256_Final(hash, &sha256);
        
        // Convert to hex
        char outputBuffer[65];
        for(int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            sprintf(outputBuffer + (i * 2), "%02x", hash[i]);
        }
        outputBuffer[64] = 0;
        
        return std::string(outputBuffer);
    }

    // PBKDF2 key derivation
    std::string deriveKey(const std::string& password, const std::string& salt) {
        unsigned char key[KEY_SIZE];
        
        PKCS5_PBKDF2_HMAC(
            password.c_str(), password.length(),
            reinterpret_cast<const unsigned char*>(salt.c_str()), salt.length(),
            PBKDF2_ITERATIONS,
            EVP_sha256(),
            KEY_SIZE,
            key
        );
        
        return std::string(reinterpret_cast<char*>(key), KEY_SIZE);
    }

    // AES-256-GCM encryption
    std::string encrypt(const std::string& plaintext, const std::string& key) {
        // Implementation of AES-256-GCM encryption
        // Returns encrypted data with IV and auth tag
        return ""; // Placeholder
    }

    std::string decrypt(const std::string& ciphertext, const std::string& key) {
        // Implementation of AES-256-GCM decryption
        return ""; // Placeholder
    }
};

// ==================== SESSION MANAGEMENT ====================

struct Session {
    std::string sessionId;
    std::string userId;
    std::string ipAddress;
    std::string userAgent;
    std::chrono::system_clock::time_point createdAt;
    std::chrono::system_clock::time_point lastActivity;
    bool isValid;
    int failedAttempts;
};

class SessionManager {
private:
    std::map<std::string, Session> activeSessions;
    static constexpr int MAX_SESSION_DURATION = 3600; // 1 hour
    static constexpr int MAX_IDLE_TIME = 900; // 15 minutes
    static constexpr int MAX_FAILED_ATTEMPTS = 5;
    
    std::string generateSessionId() {
        unsigned char randomBytes[32];
        RAND_bytes(randomBytes, 32);
        
        char sessionId[65];
        for(int i = 0; i < 32; i++) {
            sprintf(sessionId + (i * 2), "%02x", randomBytes[i]);
        }
        sessionId[64] = 0;
        
        return std::string(sessionId);
    }

public:
    std::string createSession(const std::string& userId, const std::string& ipAddress, 
                             const std::string& userAgent) {
        Session session;
        session.sessionId = generateSessionId();
        session.userId = userId;
        session.ipAddress = ipAddress;
        session.userAgent = userAgent;
        session.createdAt = std::chrono::system_clock::now();
        session.lastActivity = std::chrono::system_clock::now();
        session.isValid = true;
        session.failedAttempts = 0;
        
        activeSessions[session.sessionId] = session;
        return session.sessionId;
    }

    bool validateSession(const std::string& sessionId, const std::string& ipAddress,
                        const std::string& userAgent) {
        auto it = activeSessions.find(sessionId);
        if (it == activeSessions.end()) {
            return false;
        }

        Session& session = it->second;
        auto now = std::chrono::system_clock::now();
        
        // Check session validity
        if (!session.isValid) return false;
        
        // Check IP address match (prevent session hijacking)
        if (session.ipAddress != ipAddress) {
            session.isValid = false;
            return false;
        }
        
        // Check User-Agent match
        if (session.userAgent != userAgent) {
            session.isValid = false;
            return false;
        }
        
        // Check session timeout
        auto sessionDuration = std::chrono::duration_cast<std::chrono::seconds>(
            now - session.createdAt
        ).count();
        if (sessionDuration > MAX_SESSION_DURATION) {
            session.isValid = false;
            return false;
        }
        
        // Check idle timeout
        auto idleDuration = std::chrono::duration_cast<std::chrono::seconds>(
            now - session.lastActivity
        ).count();
        if (idleDuration > MAX_IDLE_TIME) {
            session.isValid = false;
            return false;
        }
        
        // Update last activity
        session.lastActivity = now;
        return true;
    }

    void invalidateSession(const std::string& sessionId) {
        auto it = activeSessions.find(sessionId);
        if (it != activeSessions.end()) {
            it->second.isValid = false;
        }
    }

    void cleanupExpiredSessions() {
        auto now = std::chrono::system_clock::now();
        for (auto it = activeSessions.begin(); it != activeSessions.end();) {
            auto sessionDuration = std::chrono::duration_cast<std::chrono::seconds>(
                now - it->second.createdAt
            ).count();
            
            if (sessionDuration > MAX_SESSION_DURATION || !it->second.isValid) {
                it = activeSessions.erase(it);
            } else {
                ++it;
            }
        }
    }
};

// ==================== RATE LIMITING ====================

class RateLimiter {
private:
    struct RateLimit {
        int requestCount;
        std::chrono::system_clock::time_point windowStart;
    };
    
    std::map<std::string, RateLimit> rateLimits;
    static constexpr int MAX_REQUESTS_PER_WINDOW = 100;
    static constexpr int WINDOW_DURATION = 60; // 60 seconds

public:
    bool checkRateLimit(const std::string& identifier) {
        auto now = std::chrono::system_clock::now();
        auto& limit = rateLimits[identifier];
        
        auto windowDuration = std::chrono::duration_cast<std::chrono::seconds>(
            now - limit.windowStart
        ).count();
        
        if (windowDuration > WINDOW_DURATION) {
            // Reset window
            limit.requestCount = 1;
            limit.windowStart = now;
            return true;
        }
        
        if (limit.requestCount >= MAX_REQUESTS_PER_WINDOW) {
            return false; // Rate limit exceeded
        }
        
        limit.requestCount++;
        return true;
    }

    void cleanup() {
        auto now = std::chrono::system_clock::now();
        for (auto it = rateLimits.begin(); it != rateLimits.end();) {
            auto windowDuration = std::chrono::duration_cast<std::chrono::seconds>(
                now - it->second.windowStart
            ).count();
            
            if (windowDuration > WINDOW_DURATION * 2) {
                it = rateLimits.erase(it);
            } else {
                ++it;
            }
        }
    }
};

// ==================== INPUT VALIDATION ====================

class InputValidator {
public:
    static bool isValidUsername(const std::string& username) {
        if (username.length() < 3 || username.length() > 50) return false;
        
        for (char c : username) {
            if (!isalnum(c) && c != '_' && c != '-') {
                return false;
            }
        }
        return true;
    }

    static bool isValidPassword(const std::string& password) {
        if (password.length() < 8 || password.length() > 128) return false;
        
        bool hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        
        for (char c : password) {
            if (isupper(c)) hasUpper = true;
            else if (islower(c)) hasLower = true;
            else if (isdigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit;
    }

    static std::string sanitizeInput(const std::string& input) {
        std::string sanitized;
        for (char c : input) {
            // Remove dangerous characters
            if (c != '<' && c != '>' && c != '&' && c != '"' && c != '\'') {
                sanitized += c;
            }
        }
        return sanitized;
    }

    static bool isValidJSON(const std::string& json) {
        // Basic JSON validation
        int braceCount = 0, bracketCount = 0;
        bool inString = false;
        
        for (size_t i = 0; i < json.length(); i++) {
            char c = json[i];
            
            if (c == '"' && (i == 0 || json[i-1] != '\\')) {
                inString = !inString;
            }
            
            if (!inString) {
                if (c == '{') braceCount++;
                else if (c == '}') braceCount--;
                else if (c == '[') bracketCount++;
                else if (c == ']') bracketCount--;
            }
        }
        
        return braceCount == 0 && bracketCount == 0 && !inString;
    }
};

// ==================== AUDIT LOGGING ====================

class AuditLogger {
private:
    struct LogEntry {
        std::chrono::system_clock::time_point timestamp;
        std::string userId;
        std::string action;
        std::string ipAddress;
        std::string details;
        bool success;
    };
    
    std::vector<LogEntry> logs;

public:
    void log(const std::string& userId, const std::string& action,
             const std::string& ipAddress, const std::string& details, bool success) {
        LogEntry entry;
        entry.timestamp = std::chrono::system_clock::now();
        entry.userId = userId;
        entry.action = action;
        entry.ipAddress = ipAddress;
        entry.details = details;
        entry.success = success;
        
        logs.push_back(entry);
        
        // Write to file (implementation needed)
        writeToFile(entry);
    }

private:
    void writeToFile(const LogEntry& entry) {
        // Write to secure log file with proper permissions
        // Implementation needed
    }
};

// ==================== JWT TOKEN MANAGER ====================

class JWTManager {
private:
    std::string secretKey;
    static constexpr int TOKEN_EXPIRATION = 3600; // 1 hour

public:
    JWTManager(const std::string& secret) : secretKey(secret) {}

    std::string generateToken(const std::string& userId, const std::string& role) {
        auto token = jwt::create()
            .set_issuer("boysun-timetable")
            .set_type("JWT")
            .set_payload_claim("userId", jwt::claim(userId))
            .set_payload_claim("role", jwt::claim(role))
            .set_issued_at(std::chrono::system_clock::now())
            .set_expires_at(std::chrono::system_clock::now() + std::chrono::seconds{TOKEN_EXPIRATION})
            .sign(jwt::algorithm::hs256{secretKey});
        
        return token;
    }

    bool validateToken(const std::string& token, std::string& userId, std::string& role) {
        try {
            auto decoded = jwt::decode(token);
            auto verifier = jwt::verify()
                .allow_algorithm(jwt::algorithm::hs256{secretKey})
                .with_issuer("boysun-timetable");
            
            verifier.verify(decoded);
            
            userId = decoded.get_payload_claim("userId").as_string();
            role = decoded.get_payload_claim("role").as_string();
            
            return true;
        } catch (const std::exception& e) {
            return false;
        }
    }
};

} // namespace TimetableSecurity

#endif // SECURITY_CORE_HPP
