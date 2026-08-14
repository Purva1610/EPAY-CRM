# PowerShell script to test all HTML file links in ePay CRM
# This script verifies that all navigation links point to existing files

$workspacePath = "c:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ePay CRM Link Verification Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Get all HTML files
$allHtmlFiles = Get-ChildItem -Path $workspacePath -Filter "*.html" -Name | Where-Object { $_ -notmatch "navigation-component|logout-button|auth-service.test" }

Write-Host "`nFound $($allHtmlFiles.Count) HTML files to test" -ForegroundColor White

# Define expected navigation links from the navigation component
$navLinks = @(
    # Admin Portals
    "admin.html",
    "superadmin.html",
    "crmadmin.html",
    # Executive
    "MD.html",
    "CFO.html",
    "CGO.html",
    "CMO.html",
    "CTO.html",
    # Management
    "generalmanager.html",
    "hqhead.html",
    "hqmanager.html",
    "statedirector.html",
    "statehead.html",
    "technicaldirector.html",
    "financehead.html",
    "gallerymanager.html",
    "gallerydistrictmanager.html",
    "galleryowner.html",
    "arrival manager.html",
    "assistantmanager.html",
    # Departments
    "hr.html",
    "accountant.html",
    "finance.html",
    "financepage.html",
    "BDE.html",
    "BDO.html",
    "affiliate.html",
    "socialmediamanager.html",
    "marketingExecutive.html",
    "digital marketing.html",
    "telecalling.html",
    "technical support.html",
    "customer.html",
    # AI & Automation
    "ai-assistant.html",
    "ai-business.html",
    "emergency.html",
    "emergency assitant.html",
    # Services
    "accomodation.html",
    "booking.html",
    "moving.html",
    "relocation.html",
    "rental.html",
    "property.html",
    "insurance.html",
    "travel-promotion.html",
    "wallet.html",
    "language.html",
    # Business Solutions
    "business-startup.html",
    "franchise-discovery.html",
    "franchise-saas.html",
    "msme-digital.html",
    "commerce.html",
    "institution-marketplace.html",
    "service-marketplace.html",
    "vendor-partnership.html",
    "vendor-login.html",
    "referral-crm.html",
    # Career & Talent
    "career-hub.html",
    "jobportal.html",
    "talentflow.html",
    "skill academy.html",
    "developerhub.html",
    "journey-score.html",
    # Other
    "diaspora.html",
    "index.html",
    "login.html"
)

# Test 1: Check if all navigation links exist as files
Write-Host "`n--- Test 1: Verifying Navigation Link Targets ---" -ForegroundColor Yellow
$missingFiles = @()
$existingFiles = @()

foreach ($link in $navLinks) {
    $fullPath = Join-Path $workspacePath $link
    if (Test-Path $fullPath) {
        $existingFiles += $link
        Write-Host "  OK: $link" -ForegroundColor Green
    } else {
        $missingFiles += $link
        Write-Host "  MISSING: $link" -ForegroundColor Red
    }
}

# Test 2: Check for orphan HTML files (not in navigation)
Write-Host "`n--- Test 2: Checking for Orphan HTML Files ---" -ForegroundColor Yellow
$orphanFiles = @()
foreach ($file in $allHtmlFiles) {
    if ($navLinks -notcontains $file) {
        $orphanFiles += $file
        Write-Host "  ORPHAN: $file (not in navigation)" -ForegroundColor Yellow
    }
}

# Test 3: Check navigation injection in all files
Write-Host "`n--- Test 3: Verifying Navigation Injection ---" -ForegroundColor Yellow
$filesWithNav = 0
$filesWithoutNav = @()

foreach ($file in $allHtmlFiles) {
    $filePath = Join-Path $workspacePath $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        if ($content -match 'nav-container') {
            $filesWithNav++
        } else {
            $filesWithoutNav += $file
            Write-Host "  NO NAV: $file" -ForegroundColor Red
        }
    }
}

# Test 4: Check logout button in all files
Write-Host "`n--- Test 4: Verifying Logout Button ---" -ForegroundColor Yellow
$filesWithLogout = 0
$filesWithoutLogout = @()

foreach ($file in $allHtmlFiles) {
    $filePath = Join-Path $workspacePath $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        if ($content -match 'logout-button-container') {
            $filesWithLogout++
        } else {
            $filesWithoutLogout += $file
            Write-Host "  NO LOGOUT: $file" -ForegroundColor Red
        }
    }
}

# Summary Report
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "LINK TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Navigation Links Verified: $($existingFiles.Count) / $($navLinks.Count)" -ForegroundColor Green
Write-Host "Missing Target Files: $($missingFiles.Count)" -ForegroundColor $(if ($missingFiles.Count -gt 0) { "Red" } else { "Green" })
Write-Host "Orphan HTML Files: $($orphanFiles.Count)" -ForegroundColor $(if ($orphanFiles.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host "Files with Navigation: $filesWithNav / $($allHtmlFiles.Count)" -ForegroundColor $(if ($filesWithNav -eq $allHtmlFiles.Count) { "Green" } else { "Yellow" })
Write-Host "Files with Logout: $filesWithLogout / $($allHtmlFiles.Count)" -ForegroundColor $(if ($filesWithLogout -eq $allHtmlFiles.Count) { "Green" } else { "Yellow" })

if ($missingFiles.Count -gt 0) {
    Write-Host "`nMissing Files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "  - $_" }
}

if ($filesWithoutNav.Count -gt 0) {
    Write-Host "`nFiles Missing Navigation:" -ForegroundColor Yellow
    $filesWithoutNav | ForEach-Object { Write-Host "  - $_" }
}

if ($filesWithoutLogout.Count -gt 0) {
    Write-Host "`nFiles Missing Logout Button:" -ForegroundColor Yellow
    $filesWithoutLogout | ForEach-Object { Write-Host "  - $_" }
}

Write-Host "`n========================================" -ForegroundColor Cyan
