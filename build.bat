@echo off
REM Boysun IM Timetable Server - Windows Build Script

echo ========================================
echo Boysun IM - Secure Timetable Server
echo ========================================
echo.

REM Check if CMake is installed
where cmake >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] CMake is not installed!
    echo Please install CMake from: https://cmake.org/download/
    pause
    exit /b 1
)

REM Check if Visual Studio or MinGW is available
where cl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set COMPILER=MSVC
    echo [INFO] Using MSVC compiler
) else (
    where g++ >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        set COMPILER=MinGW
        echo [INFO] Using MinGW compiler
    ) else (
        echo [ERROR] No C++ compiler found!
        echo Please install Visual Studio or MinGW
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Building server...
echo.

REM Create build directory
if not exist build mkdir build
cd build

REM Configure
echo [INFO] Configuring...
if "%COMPILER%"=="MSVC" (
    cmake .. -G "Visual Studio 16 2019" -A x64
) else (
    cmake .. -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release
)

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Configuration failed!
    cd ..
    pause
    exit /b 1
)

REM Build
echo.
echo [INFO] Compiling...
cmake --build . --config Release

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    cd ..
    pause
    exit /b 1
)

cd ..

REM Create data directory
if not exist data mkdir data

REM Create default config
if not exist data\config.json (
    echo [INFO] Creating default configuration...
    (
        echo {
        echo     "server": {
        echo         "host": "0.0.0.0",
        echo         "port": 8080,
        echo         "enableHTTPS": false
        echo     },
        echo     "security": {
        echo         "jwtSecret": "CHANGE_THIS_SECRET_KEY",
        echo         "sessionTimeout": 3600
        echo     }
        echo }
    ) > data\config.json
)

echo.
echo ========================================
echo [SUCCESS] Build complete!
echo ========================================
echo.
echo Next steps:
echo   1. Review data\config.json
echo   2. Change JWT secret key
echo   3. Run: build\Release\timetable_server.exe
echo.
echo Security checklist:
echo   - Change default JWT secret
echo   - Enable HTTPS for production
echo   - Configure Windows Firewall
echo   - Set up regular backups
echo.

pause
