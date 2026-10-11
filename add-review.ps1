# add-review.ps1 - add one approved client review to lib/reviews.ts
$ErrorActionPreference = "Stop"
if (-not (Test-Path "lib/reviews.ts")) { Write-Host "ERROR: run this inside the project folder" -ForegroundColor Red; exit 1 }
$utf8 = New-Object System.Text.UTF8Encoding($false)

$name = (Read-Host "Client name (for example: Rahul S.)").Trim()
$event = (Read-Host "Event type (Wedding / Reception / Engagement Function / Other Event)").Trim()
$ratingIn = (Read-Host "Rating 1-5 [5]").Trim()
$text = (Read-Host "Review text (exactly what the client wrote, on one line)").Trim()

if (-not $name -or $name.Length -lt 2) { Write-Host "Name is required." -ForegroundColor Red; exit 1 }
if (-not $event) { $event = "Wedding" }
if (-not $ratingIn) { $ratingIn = "5" }
$rating = 0
if (-not [int]::TryParse($ratingIn, [ref]$rating) -or $rating -lt 1 -or $rating -gt 5) { Write-Host "Rating must be 1 to 5." -ForegroundColor Red; exit 1 }
if ($text.Length -lt 10) { Write-Host "Review text is too short." -ForegroundColor Red; exit 1 }

$nameJs = $name  | ConvertTo-Json -Compress
$eventJs = $event | ConvertTo-Json -Compress
$textJs = $text  | ConvertTo-Json -Compress
$id = "r" + (Get-Date -Format "yyyyMMddHHmmss")

$path = Join-Path (Get-Location) "lib/reviews.ts"
$src = [System.IO.File]::ReadAllText($path)

$ans = (Read-Host "Remove the SAMPLE cards now? (y/n) [y]").Trim().ToLower()
if ($ans -ne "n") {
    $src = [regex]::Replace($src, '\{[^{}]*sample:\s*true[^{}]*\},?\s*', '')
}

$entry = @"
  {
    id: "$id",
    name: $nameJs,
    eventType: $eventJs,
    rating: $rating,
    text: $textJs,
  },

"@

$idx = $src.LastIndexOf("];")
if ($idx -lt 0) { Write-Host "Could not find the end of the reviews list in lib/reviews.ts" -ForegroundColor Red; exit 1 }
$src = $src.Substring(0, $idx) + $entry + $src.Substring($idx)
[System.IO.File]::WriteAllText($path, $src, $utf8)

Write-Host "`nReview added for $name ($rating stars)." -ForegroundColor Green
Write-Host "Next: check it on localhost, then run:  git add .  /  git commit -m ""Add client review""  /  git push" -ForegroundColor Yellow