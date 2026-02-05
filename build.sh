#!/bin/bash

# Boysun IM Timetable Server - Build Script
# This script builds and runs the secure C++ backend server

set -e  # Exit on error

echo "🔒 Boysun IM - Secure Timetable Server"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run as root${NC}"
    exit 1
fi

# Check dependencies
echo "📦 Checking dependencies..."

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    fi
}

MISSING_DEPS=0

check_command cmake || MISSING_DEPS=1
check_command g++ || MISSING_DEPS=1
check_command git || MISSING_DEPS=1

# Check OpenSSL
if ! pkg-config --exists openssl; then
    echo -e "${RED}❌ OpenSSL is not installed${NC}"
    MISSING_DEPS=1
else
    echo -e "${GREEN}✅ OpenSSL is installed${NC}"
fi

if [ $MISSING_DEPS -eq 1 ]; then
    echo ""
    echo -e "${YELLOW}Installing missing dependencies...${NC}"
    echo "Run: sudo apt install -y build-essential cmake libssl-dev git"
    exit 1
fi

echo ""
echo "🏗️  Building server..."

# Create build directory
mkdir -p build
cd build

# Configure with CMake
echo "⚙️  Configuring..."
cmake .. -DCMAKE_BUILD_TYPE=Release

# Build
echo "🔨 Compiling..."
make -j$(nproc)

echo ""
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Create data directory
cd ..
mkdir -p data

# Create default configuration
if [ ! -f "data/config.json" ]; then
    echo "📝 Creating default configuration..."
    cat > data/config.json << EOF
{
    "server": {
        "host": "0.0.0.0",
        "port": 8080,
        "enableHTTPS": false,
        "certPath": "",
        "keyPath": ""
    },
    "security": {
        "jwtSecret": "CHANGE_THIS_SECRET_KEY_IN_PRODUCTION",
        "sessionTimeout": 3600,
        "maxFailedAttempts": 5,
        "rateLimitPerMinute": 100
    },
    "database": {
        "dataPath": "./data/"
    }
}
EOF
fi

# Create systemd service file
echo "📋 Creating systemd service..."
cat > timetable-server.service << EOF
[Unit]
Description=Boysun IM Timetable Secure Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/build/timetable_server
Restart=always
RestartSec=10

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$(pwd)/data

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "  1. Review configuration in data/config.json"
echo "  2. Change JWT secret key"
echo "  3. Run server: ./build/timetable_server"
echo ""
echo "🔐 Security checklist:"
echo "  ✓ Change default JWT secret"
echo "  ✓ Enable HTTPS for production"
echo "  ✓ Configure firewall"
echo "  ✓ Set up regular backups"
echo "  ✓ Monitor audit logs"
echo ""
echo "📖 Read README_SECURITY.md for more information"
echo ""

# Ask if user wants to start server
read -p "Do you want to start the server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting server..."
    ./build/timetable_server
fi
