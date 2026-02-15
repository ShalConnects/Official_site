# Copy RAK Consignment case study images into this folder. Run from repo root or this folder.
$dest = $PSScriptRoot
$review = "C:\Users\salau\Documents\Review"
$dl = "C:\Users\salau\Downloads"
$mindy = "C:\Users\salau\Downloads\mindyloll\rak fb banner"

if (!(Test-Path $review)) { Write-Host "Review folder not found: $review"; exit 1 }
Copy-Item "$review\Screenshot_7.png"  "$dest\convo-7.png"   -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_8.png"  "$dest\convo-8.png"   -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_9.png"  "$dest\convo-9.png"   -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_10.png" "$dest\convo-10.png"  -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_11.png" "$dest\convo-11.png"  -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_12.png" "$dest\store-header.png" -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_12.png" "$dest\convo-12.png"  -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_13.png" "$dest\convo-13.png"  -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_14.png" "$dest\feedback-1.png" -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_15.png" "$dest\feedback-2.png" -ErrorAction SilentlyContinue
Copy-Item "$review\Screenshot_16.png" "$dest\feedback-3.png" -ErrorAction SilentlyContinue
if (Test-Path $mindy) { Copy-Item "$mindy\rak fb banner.jpg" "$dest\fb-banner.jpg" -ErrorAction SilentlyContinue }
$listing = Get-ChildItem "$dl" -Filter "*sample*18*html*2026*21_02_25*" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($listing) { Copy-Item $listing.FullName "$dest\listing-sample.png" -ErrorAction SilentlyContinue }
Write-Host "Done. Check that listing-sample.png exists (screencapture file); copy manually if needed."
