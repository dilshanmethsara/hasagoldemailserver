@echo off
echo ========================================
echo HASA GOLD STORE - Email Server Startup
echo ========================================
echo.
echo Starting professional email server...
echo Server will run on: http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist node_modules\nodemailer (
    echo Installing email server dependencies...
    npm install nodemailer express cors
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the email server
echo Starting email server...
node email-server.js

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Email server failed to start
    echo Please check your configuration in email-server.js
    pause
)

echo.
echo Email server stopped.
pause
