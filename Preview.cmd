@echo off
cd /d "%~dp0"
node scripts/build.mjs
if errorlevel 1 goto failed
echo.
echo Open http://127.0.0.1:4173/ in your browser.
echo Keep this window open while previewing. Press Ctrl+C to stop.
node scripts/preview.mjs
goto end
:failed
echo Website could not be built.
pause
:end
