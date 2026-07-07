@echo off
rem Elemental Blueprint: static app + local Claude companion (Ask).
rem index.html also works opened directly; the companion (server.js)
rem enables the Ask section through your Claude Code login.
wt -w 0 new-tab --title "Elemental Blueprint" -d "%~dp0" cmd /k node server.js
timeout /t 3 >nul
start http://localhost:8873
