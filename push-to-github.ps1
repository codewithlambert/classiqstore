Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLASSIQ Store - Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "Staging all changes..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Transform to shoes & bags store - Complete UI/UX update with WhatsApp checkout"

Write-Host ""
Write-Host "Checking remote..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "Pushing to codewithlambert/classiqstore..." -ForegroundColor Yellow

# Try pushing to main first
try {
    git push origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Push complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} catch {
    Write-Host "Main branch failed, trying master..." -ForegroundColor Yellow
    git push origin master
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Push complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
