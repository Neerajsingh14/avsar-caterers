# fix-push.ps1 - clean .env.example, redo the unpushed commit without secrets, push, copy the correct block for Vercel
$ErrorActionPreference = "Continue"
if (-not (Test-Path "package.json")) { Write-Host "ERROR: run this inside the project folder" -ForegroundColor Red; exit 1 }
$utf8 = New-Object System.Text.UTF8Encoding($false)
$envPath = Join-Path (Get-Location) ".env.local"

function Get-Env($name) {
    if (-not (Test-Path $envPath)) { return "" }
    foreach ($l in [System.IO.File]::ReadAllLines($envPath)) {
        if ($l -match ("^" + [regex]::Escape($name) + "=(.*)$")) { return $Matches[1].Trim() }
    }
    return ""
}
function Last4($s) { if ($s.Length -ge 4) { return $s.Substring($s.Length - 4) } else { return "****" } }
$keyPattern = 'github_pat_[A-Za-z0-9_]{20,}|(^|[^A-Za-z0-9])re_[A-Za-z0-9]{20,}'

# ---------- 1. clean .env.example ----------
Write-Host "`n--- 1. Cleaning .env.example ---" -ForegroundColor Cyan
$exPath = Join-Path (Get-Location) ".env.example"
if (Test-Path $exPath) {
    $ex = [System.IO.File]::ReadAllText($exPath)
    $cur = Get-Env "GITHUB_TOKEN"
    foreach ($h in [regex]::Matches($ex, 'github_pat_[A-Za-z0-9_]{20,}|re_[A-Za-z0-9]{20,}')) {
        if ($h.Value -ceq $cur) {
            Write-Host ("Your CURRENT token (ends with ..." + (Last4 $h.Value) + ") was inside .env.example. It was never uploaded, GitHub blocked it.") -ForegroundColor Yellow
        }
        else {
            Write-Host ("A key (ends with ..." + (Last4 $h.Value) + ") was inside .env.example. If you do not use it anymore, delete it on GitHub or Resend.") -ForegroundColor Yellow
        }
    }
}
$clean = @'
RESEND_API_KEY=
BUSINESS_EMAIL=
FROM_EMAIL=onboarding@resend.dev
SEND_CLIENT_CONFIRMATION=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVIEW_APPROVE_SECRET=
GITHUB_TOKEN=
GITHUB_REPO=Neerajsingh14/avsar-caterers
'@
[System.IO.File]::WriteAllText($exPath, $clean, $utf8)
Write-Host "OK   .env.example now has empty values only" -ForegroundColor Green

# ---------- 2. git: redo the unpushed commit ----------
Write-Host "`n--- 2. Git ---" -ForegroundColor Cyan
$tracked = git ls-files .env.local
if ($tracked) { Write-Host "STOP: .env.local is tracked by git. Send me this message." -ForegroundColor Red; exit 1 }

git fetch origin 2>$null | Out-Null
$ahead = @(git rev-list "origin/main..HEAD").Count
if ($ahead -gt 0) {
    git reset --soft origin/main
    Write-Host ("OK   removed " + $ahead + " local commit(s) that were never pushed (your changes are kept)") -ForegroundColor Green
}
else {
    Write-Host "No unpushed commits." -ForegroundColor DarkYellow
}

git add .
$staged = @(git diff --cached --name-only)
$bad = @($staged | Where-Object { $_ -match '(^|/)\.env' -and $_ -ne '.env.example' })
if ($bad.Count -gt 0) {
    git reset | Out-Null
    Write-Host "STOP: an .env file was about to be uploaded. Nothing was pushed:" -ForegroundColor Red
    $bad | ForEach-Object { Write-Host "   $_" }
    exit 1
}
$diff = (git diff --cached) -join "`n"
if ($diff -cmatch $keyPattern) {
    git reset | Out-Null
    Write-Host "STOP: a key-like text is still in the files to upload. Nothing was pushed. Send me this message." -ForegroundColor Red
    exit 1
}
Write-Host "OK   nothing secret in the files to upload" -ForegroundColor Green

git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "Reviews go live instantly" | Out-Null
    Write-Host "OK   new clean commit created" -ForegroundColor Green
}
git push
if ($LASTEXITCODE -ne 0) { Write-Host "STOP: git push failed. Send me the message above." -ForegroundColor Red; exit 1 }
Write-Host "OK   code pushed. Vercel will start a new deployment." -ForegroundColor Green

# ---------- 3. correct block for Vercel ----------
Write-Host "`n--- 3. Vercel ---" -ForegroundColor Cyan
$secret = Get-Env "REVIEW_APPROVE_SECRET"
$token = Get-Env "GITHUB_TOKEN"
if (-not $secret -or -not $token) {
    Write-Host "STOP: REVIEW_APPROVE_SECRET or GITHUB_TOKEN is missing in .env.local. Run setup-keys.ps1 again." -ForegroundColor Red
    exit 1
}
$block = "REVIEW_APPROVE_SECRET=$secret`nGITHUB_TOKEN=$token`nGITHUB_REPO=Neerajsingh14/avsar-caterers"
Set-Clipboard -Value $block
Write-Host "COPIED to clipboard: 3 variables (the last time only 1 line was copied, that was my bug)." -ForegroundColor Green
Write-Host "In Vercel -> avsar-caterers -> Settings -> Environment Variables:" -ForegroundColor Yellow
Write-Host "  1) delete any wrong variable from last time and the old REVIEW_APPROVE_SECRET / GITHUB_TOKEN / GITHUB_REPO"
Write-Host "  2) keep RESEND_API_KEY, BUSINESS_EMAIL, FROM_EMAIL, NEXT_PUBLIC_SITE_URL as they are"
Write-Host "  3) click the Key box, press Ctrl+V (3 variables appear), tick Sensitive for GITHUB_TOKEN, Save"
[void](Read-Host "`nPress Enter AFTER you saved them in Vercel (this clears the clipboard)")
Set-Clipboard -Value " "
Write-Host "Clipboard cleared." -ForegroundColor Green

Write-Host "`nLast steps:" -ForegroundColor Cyan
Write-Host "  - Vercel: Deployments -> top deployment -> ... -> Redeploy"
Write-Host "  - Restart the dev server:  npm run dev -- -p 3001"
Write-Host "  - Test: submit a review named TEST ONLY on the live site"