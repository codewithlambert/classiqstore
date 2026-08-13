@echo off
echo ========================================
echo CLASSIQ Store - Push to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Staging all changes...
git add .

echo.
echo Committing changes...
git commit -m "Transform to shoes & bags store - Complete UI/UX update with WhatsApp checkout"

echo.
echo Checking remote...
git remote -v

echo.
echo Pushing to codewithlambert/classiqstore...
git push origin main

if errorlevel 1 (
    echo.
    echo Push failed! Trying 'master' branch...
    git push origin master
)

echo.
echo ========================================
echo Push complete!
echo ========================================
echo.
pause
