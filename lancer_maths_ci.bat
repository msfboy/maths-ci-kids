@echo off
title Maths CI - Serveur pour Telephone & PC
cd /d "%~dp0"
echo ========================================================
echo       LANCEMENT DE MATHS CI (JARDIN D'ENFANTS)
echo ========================================================
echo.
echo Ouvrez cette adresse sur votre telephone :
echo   http://10.10.5.53:5173
echo.
echo Ou sur cet ordinateur :
echo   http://localhost:5173
echo.
echo ========================================================
npm run dev -- --host 0.0.0.0 --port 5173
pause
