@echo off
REM ============================================================
REM  God's Eye View - local launcher
REM  Core principle: every cache / temp / browser-download path
REM  is pinned to the K: drive so nothing grows on C:.
REM ============================================================
setlocal

set "GEV_HOME=K:\work-DEEPSEEK\gods-eye-view"
set "GEV_CACHE_ROOT=K:\work-DEEPSEEK"

REM Temp + npm cache + Puppeteer browser cache all live on K:
set "TEMP=%GEV_CACHE_ROOT%\.tmp"
set "TMP=%GEV_CACHE_ROOT%\.tmp"
set "npm_config_cache=%GEV_CACHE_ROOT%\.npm-cache"
set "PUPPETEER_CACHE_DIR=%GEV_CACHE_ROOT%\.puppeteer-cache"
set "ELECTRON_CACHE=%GEV_CACHE_ROOT%\.electron-cache"

if not exist "%TEMP%" mkdir "%TEMP%"
if not exist "%npm_config_cache%" mkdir "%npm_config_cache%"
if not exist "%PUPPETEER_CACHE_DIR%" mkdir "%PUPPETEER_CACHE_DIR%"

cd /d "%GEV_HOME%"

echo ============================================================
echo  God's Eye View
echo  App URL : http://localhost:4173/
echo  Caches  : %GEV_CACHE_ROOT%   (C: untouched)
echo  Stop    : press Ctrl+C in this window
echo ============================================================
echo.

call npm run dev
