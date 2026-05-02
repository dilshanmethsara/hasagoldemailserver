@echo off
echo Starting HASA GOLD STORE Email Server...
echo.

REM Set Node.js to use CommonJS
set NODE_OPTIONS=--experimental-modules

REM Try to start the server
node simple-email-server.js

if %errorlevel% neq 0 (
    echo.
    echo Server startup failed. Trying alternative method...
    node --input-type=commonjs simple-email-server.js
)

pause
