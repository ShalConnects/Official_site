# PowerShell script to copy review screenshots to public/images/reviews/
# This script copies all Screenshot_*.png files from the source directory to the reviews folder

$sourceDir = "C:\Users\salau\Downloads\Salauddin"
$targetDir = "public\images\reviews"

# Create target directory if it doesn't exist
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "Created directory: $targetDir" -ForegroundColor Green
}

# Get all screenshot files
$screenshotFiles = Get-ChildItem -Path $sourceDir -Filter "Screenshot_*.png"

if ($screenshotFiles.Count -eq 0) {
    Write-Host "No Screenshot_*.png files found in $sourceDir" -ForegroundColor Yellow
    exit
}

Write-Host "Found $($screenshotFiles.Count) screenshot files" -ForegroundColor Cyan

# Copy files
$copied = 0
$skipped = 0
foreach ($file in $screenshotFiles) {
    $targetPath = Join-Path $targetDir $file.Name
    
    if (Test-Path $targetPath) {
        Write-Host "Skipping (already exists): $($file.Name)" -ForegroundColor Gray
        $skipped++
    } else {
        Copy-Item -Path $file.FullName -Destination $targetPath -Force
        Write-Host "Copied: $($file.Name)" -ForegroundColor Green
        $copied++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Copied: $copied files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files" -ForegroundColor Yellow
Write-Host "  Total: $($screenshotFiles.Count) files" -ForegroundColor White

Write-Host "`nAll review images have been copied to: $targetDir" -ForegroundColor Green
Write-Host "You can now use them in the ReviewsGallery component!" -ForegroundColor Green
