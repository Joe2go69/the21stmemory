# ============================================================
#  21stmemory.com -> GitHub Pages Setup (Steps 3-5)
#  Secrets via environment variables only -- never hardcode.
#
#  Before running (in this PowerShell session only):
#    $env:PORKBUN_API_KEY    = "pk1_..."
#    $env:PORKBUN_SECRET_KEY = "sk1_..."
#    $env:GITHUB_TOKEN       = "ghp_..."   # needs repo admin for Pages
#
#  Domain plan:
#    - 21stmemory.com      -> primary GitHub Pages site (this script)
#    - the21stmemory.com   -> URL forward / 301 at Porkbun to https://21stmemory.com
#      (do NOT point the21stmemory A/CNAME at GitHub; use Porkbun URL Forwarding)
# ============================================================

$PorkbunApiKey    = $env:PORKBUN_API_KEY
$PorkbunSecretKey = $env:PORKBUN_SECRET_KEY
$GitHubToken      = $env:GITHUB_TOKEN

$Domain           = "21stmemory.com"
$GitHubUsername   = "Joe2go69"
$RepoName         = "the21stmemory"

if (-not $PorkbunApiKey -or -not $PorkbunSecretKey -or -not $GitHubToken) {
    Write-Host "Missing secrets. Set these in your terminal (not in the script file):" -ForegroundColor Red
    Write-Host '  $env:PORKBUN_API_KEY    = "pk1_..."'
    Write-Host '  $env:PORKBUN_SECRET_KEY = "sk1_..."'
    Write-Host '  $env:GITHUB_TOKEN       = "ghp_..."'
    exit 1
}

function Invoke-Porkbun {
    param($Endpoint, $Body)
    $json = $Body | ConvertTo-Json -Compress
    try {
        return Invoke-RestMethod -Uri "https://api.porkbun.com/api/json/v3$Endpoint" `
            -Method Post -ContentType "application/json" -Body $json
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# ---------- STEP 3: Create DNS records at Porkbun ----------
Write-Host ""
Write-Host "=== STEP 3: Creating DNS records at Porkbun ($Domain) ===" -ForegroundColor Cyan

$GitHubIPs = @(
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153"
)

Write-Host "Creating 4 A records for root domain..."
foreach ($ip in $GitHubIPs) {
    $body = @{
        apikey       = $PorkbunApiKey
        secretapikey = $PorkbunSecretKey
        name         = ""
        type         = "A"
        content      = $ip
        ttl          = "600"
    }
    $result = Invoke-Porkbun -Endpoint "/dns/create/$Domain" -Body $body
    if ($result -and $result.status -eq "SUCCESS") {
        Write-Host "  OK A -> $ip" -ForegroundColor Green
    }
    else {
        $msg = if ($result) { $result.message } else { "no response" }
        Write-Host "  FAIL A -> $ip  ($msg)" -ForegroundColor Yellow
    }
}

Write-Host "Creating CNAME for www..."
$body = @{
    apikey       = $PorkbunApiKey
    secretapikey = $PorkbunSecretKey
    name         = "www"
    type         = "CNAME"
    content      = "$GitHubUsername.github.io"
    ttl          = "600"
}
$result = Invoke-Porkbun -Endpoint "/dns/create/$Domain" -Body $body
if ($result -and $result.status -eq "SUCCESS") {
    Write-Host "  OK CNAME www -> $GitHubUsername.github.io" -ForegroundColor Green
}
else {
    $msg = if ($result) { $result.message } else { "no response" }
    Write-Host "  FAIL CNAME  ($msg)" -ForegroundColor Yellow
}

# ---------- STEP 4: Set custom domain on GitHub ----------
Write-Host ""
Write-Host "=== STEP 4: Setting custom domain on GitHub Pages ===" -ForegroundColor Cyan

$headers = @{
    Authorization          = "Bearer $GitHubToken"
    Accept                 = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$body = @{ cname = $Domain } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/repos/$GitHubUsername/$RepoName/pages" `
        -Method Put `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $body | Out-Null
    Write-Host "  OK Custom domain set to $Domain" -ForegroundColor Green
}
catch {
    Write-Host "  FAIL GitHub API error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "    (You can also set it manually in repo Settings -> Pages)" -ForegroundColor Yellow
}

# ---------- STEP 5: Check DNS ----------
Write-Host ""
Write-Host "=== STEP 5: Checking DNS resolution ===" -ForegroundColor Cyan
Write-Host "(DNS can take 5-60 minutes to fully propagate. Re-run this checker later if needed.)"
Write-Host ""

Write-Host "Checking $Domain (A records):"
try {
    $aRecords = Resolve-DnsName $Domain -Type A -ErrorAction Stop
    $aRecords | ForEach-Object {
        $color = if ($GitHubIPs -contains $_.IPAddress) { "Green" } else { "Yellow" }
        Write-Host "  $($_.IPAddress)" -ForegroundColor $color
    }
}
catch {
    Write-Host "  Not resolving yet (this is normal right after creating records)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking www.$Domain (CNAME):"
try {
    $cname = Resolve-DnsName "www.$Domain" -Type CNAME -ErrorAction Stop
    $cname | ForEach-Object {
        Write-Host "  $($_.NameHost)" -ForegroundColor Green
    }
}
catch {
    Write-Host "  Not resolving yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Script finished ===" -ForegroundColor Cyan
Write-Host "Next steps:"
Write-Host "  1. Wait until A + www CNAME resolve correctly (green above)."
Write-Host "  2. GitHub repo -> Settings -> Pages -> Enforce HTTPS."
Write-Host "  3. At Porkbun for the21stmemory.com: URL Forwarding"
Write-Host "       Destination: https://21stmemory.com"
Write-Host "       Type: permanent (301), include path if available."
Write-Host "     Do NOT add GitHub A/CNAME records on the21stmemory.com."
Write-Host "  4. Commit CNAME=21stmemory.com and push so Pages keeps the domain."
