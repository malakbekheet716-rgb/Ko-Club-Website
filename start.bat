@echo off
setlocal
title KODE Sports Club - Employee Hub
echo ========================================================
echo   KODE Sports Club - Employee Hub Launch Wizard
echo ========================================================
echo.

:: 1. Check for standard Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python detected. Starting local server on port 8080...
    start "KODELocalServer" /min python -m http.server 8080
    timeout /t 1 >nul
    start http://localhost:8080/
    goto :done
)

:: 2. Check for Python Windows Launcher (py)
where py >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python launcher detected. Starting local server on port 8080...
    start "KODELocalServer" /min py -m http.server 8080
    timeout /t 1 >nul
    start http://localhost:8080/
    goto :done
)

:: 3. Check for Node / npx
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js detected. Starting local server on port 8080...
    start "KODELocalServer" /min npx -y http-server -p 8080
    timeout /t 2 >nul
    start http://localhost:8080/
    goto :done
)

:: 4. Fallback: Direct Browser Launch
echo [NOTE] Neither Python nor Node was found in PATH.
echo Launching index.html directly in your default browser...
start index.html

:done
echo.
echo Hub launched successfully!
