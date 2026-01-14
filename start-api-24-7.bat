@echo off
echo Starting GIS Business API Server...
cd /d "%~dp0backend"
start "Backend Server" python -m uvicorn main:app --host 0.0.0.0 --port 8000
timeout /t 3
echo Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cloudflared tunnel --url http://localhost:8000
echo.
echo ========================================
echo Your API is now running!
echo Backend: http://localhost:8000
echo Public URL will be shown in the tunnel window
echo Keep both windows open to keep the API running
echo ========================================
pause
