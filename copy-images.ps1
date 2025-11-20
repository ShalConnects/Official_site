# PowerShell script to copy plugin images to public folder
# Run this script from the project root directory

$sourceDir = "C:\Users\salau\Downloads\Projects\Variation Images Pro"
$destDir = "public\images\plugin"

# Create destination directory if it doesn't exist
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

# Copy images with proper naming
$images = @{
    "preview.png" = "preview.png"
    "Screenshot_22.png" = "screenshot-dashboard.png"
    "Screenshot_23.png" = "screenshot-designer.png"
    "Screenshot_24.png" = "screenshot-settings.png"
    "Screenshot_25.png" = "screenshot-preview.png"
    "Screenshot_26.png" = "screenshot-variations.png"
    "Screenshot_27.png" = "screenshot-frontend-1.png"
    "Screenshot_28.png" = "screenshot-frontend-2.png"
    "Screenshot_29.png" = "screenshot-frontend-3.png"
    "thumbnail.png" = "thumbnail.png"
}

Write-Host "Copying plugin images..." -ForegroundColor Green

foreach ($file in $images.GetEnumerator()) {
    $sourcePath = Join-Path $sourceDir $file.Key
    $destPath = Join-Path $destDir $file.Value
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  Copied: $($file.Key) -> $($file.Value)" -ForegroundColor Cyan
    } else {
        Write-Host "  Not found: $($file.Key)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done! Images copied to $destDir" -ForegroundColor Green
