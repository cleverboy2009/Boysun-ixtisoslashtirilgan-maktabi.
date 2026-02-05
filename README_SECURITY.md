# 🔒 Boysun IM - Secure Timetable Management System

## 🛡️ Xavfsizlik Xususiyatlari

### 1. **Autentifikatsiya va Avtorizatsiya**
- ✅ JWT (JSON Web Token) asosida autentifikatsiya
- ✅ Session management (IP va User-Agent tekshiruvi)
- ✅ Parol hash (SHA-256 + PBKDF2 with 100,000 iterations)
- ✅ Salt bilan parol saqlash
- ✅ Role-based access control (RBAC)

### 2. **Ma'lumotlar Xavfsizligi**
- ✅ AES-256-GCM shifrlash
- ✅ Secure data storage
- ✅ Automatic backup creation
- ✅ Data integrity validation

### 3. **Tarmoq Xavfsizligi**
- ✅ HTTPS support (TLS 1.3)
- ✅ CORS policy
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Rate limiting (100 requests/minute)
- ✅ DDoS protection

### 4. **Session Xavfsizligi**
- ✅ Session timeout (1 hour)
- ✅ Idle timeout (15 minutes)
- ✅ Session hijacking prevention
- ✅ Automatic session cleanup

### 5. **Input Validation**
- ✅ SQL injection prevention
- ✅ XSS (Cross-Site Scripting) prevention
- ✅ CSRF (Cross-Site Request Forgery) protection
- ✅ JSON structure validation
- ✅ Input sanitization

### 6. **Audit va Monitoring**
- ✅ Detailed audit logging
- ✅ Failed login attempts tracking
- ✅ Activity monitoring
- ✅ Security event logging

## 📋 Talablar

### Dasturiy ta'minot:
- C++17 yoki yuqori
- CMake 3.15+
- OpenSSL 1.1.1+
- GCC 9+ yoki Clang 10+

### Kutubxonalar:
- cpp-httplib (HTTP server)
- nlohmann/json (JSON parsing)
- jwt-cpp (JWT tokens)
- OpenSSL (Cryptography)

## 🚀 O'rnatish

### 1. Dependencies o'rnatish (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y build-essential cmake libssl-dev git
```

### 2. Loyihani build qilish:
```bash
mkdir build
cd build
cmake ..
make -j$(nproc)
```

### 3. Serverni ishga tushirish:
```bash
./timetable_server
```

## 🔧 Konfiguratsiya

### Server sozlamalari (`server.cpp`):
```cpp
ServerConfig config;
config.host = "0.0.0.0";        // Server manzili
config.port = 8080;              // Port
config.jwtSecret = "YOUR_SECRET"; // JWT secret key (O'ZGARTIRING!)
config.dataPath = "./data/";     // Ma'lumotlar yo'li
config.enableCORS = true;        // CORS yoqish
config.enableHTTPS = true;       // HTTPS yoqish
```

### HTTPS sozlash:
```cpp
config.enableHTTPS = true;
config.certPath = "/path/to/cert.pem";
config.keyPath = "/path/to/key.pem";
```

## 📡 API Endpoints

### Authentication:
- `POST /api/auth/login` - Kirish
- `POST /api/auth/logout` - Chiqish
- `GET /api/auth/validate` - Token tekshirish

### Timetable:
- `GET /api/timetable` - Jadvalni olish
- `POST /api/timetable` - Jadvalni yangilash (Admin)

### Teachers:
- `GET /api/teachers` - O'qituvchilar ro'yxati
- `POST /api/teachers` - O'qituvchilarni yangilash (Admin)

## 🔐 API Foydalanish

### 1. Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"boysun2026"}'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "abc123...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

### 2. Get Timetable:
```bash
curl -X GET http://localhost:8080/api/timetable \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Session-ID: YOUR_SESSION_ID"
```

### 3. Update Timetable (Admin only):
```bash
curl -X POST http://localhost:8080/api/timetable \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-Session-ID: YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d @timetable.json
```

## 🛡️ Xavfsizlik Bo'yicha Tavsiyalar

### 1. **Production uchun:**
- ✅ JWT secret key'ni o'zgartiring
- ✅ HTTPS yoqing
- ✅ Firewall sozlang
- ✅ Regular backup oling
- ✅ Audit loglarni monitoring qiling

### 2. **Parol siyosati:**
- Minimal uzunlik: 8 belgi
- Katta va kichik harflar
- Raqamlar
- Maxsus belgilar (tavsiya etiladi)

### 3. **Network xavfsizligi:**
- Faqat kerakli portlarni oching
- Rate limiting sozlang
- DDoS protection yoqing
- VPN orqali admin panelga kirish

## 📊 Monitoring

### Audit loglar:
```bash
tail -f data/audit.log
```

### Session monitoring:
```bash
curl http://localhost:8080/api/admin/sessions \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 🔄 Backup va Restore

### Automatic backup:
Har safar ma'lumot yangilanganda avtomatik backup yaratiladi:
```
data/timetable_backup_1234567890.json
```

### Manual backup:
```bash
cp data/timetable.json backups/timetable_$(date +%Y%m%d_%H%M%S).json
```

## 🐛 Debugging

### Debug mode:
```bash
./timetable_server --debug
```

### Loglarni ko'rish:
```bash
tail -f data/server.log
```

## 📞 Yordam

Muammolar yoki savollar bo'lsa:
- GitHub Issues: [link]
- Email: admin@boysun-im.uz

## 📄 Litsenziya

MIT License

## 🙏 Minnatdorchilik

- OpenSSL
- cpp-httplib
- nlohmann/json
- jwt-cpp

---

**⚠️ MUHIM:** Production serverda ishlatishdan oldin barcha xavfsizlik sozlamalarini tekshiring!
