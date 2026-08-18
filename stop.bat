@echo off
echo Stopping local web server on port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do (
    echo Killing process %%a...
    taskkill /f /pid %%a
)
echo Server stopped.
pause
