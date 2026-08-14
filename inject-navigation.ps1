# PowerShell script to inject navigation component into all HTML files
# This script adds the navigation bar to all portal pages

$workspacePath = "c:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"

# HTML files to process (excluding navigation-component.html itself)
$htmlFiles = @(
    "accomodation.html",
    "accountant.html",
    "admin.html",
    "affiliate.html",
    "ai-assistant.html",
    "ai-business.html",
    "arrival manager.html",
    "assistantmanager.html",
    "BDE.html",
    "BDO.html",
    "booking.html",
    "business-startup.html",
    "career-hub.html",
    "CFO.html",
    "CGO.html",
    "CMO.html",
    "commerce.html",
    "crmadmin.html",
    "CTO.html",
    "customer.html",
    "developerhub.html",
    "diaspora.html",
    "digital marketing.html",
    "emergency assitant.html",
    "emergency.html",
    "finance.html",
    "financehead.html",
    "financepage.html",
    "franchise-discovery.html",
    "franchise-saas.html",
    "gallerydistrictmanager.html",
    "gallerymanager.html",
    "galleryowner.html",
    "generalmanager.html",
    "hqhead.html",
    "hqmanager.html",
    "hr.html",
    "institution-marketplace.html",
    "insurance.html",
    "jobportal.html",
    "journey-score.html",
    "language.html",
    "marketingExecutive.html",
    "MD.html",
    "moving.html",
    "msme-digital.html",
    "property.html",
    "referral-crm.html",
    "relocation.html",
    "rental.html",
    "service-marketplace.html",
    "skill academy.html",
    "socialmediamanager.html",
    "statedirector.html",
    "statehead.html",
    "superadmin.html",
    "talentflow.html",
    "technical support.html",
    "technicaldirector.html",
    "telecalling.html",
    "travel-promotion.html",
    "vendor-login.html",
    "vendor-partnership.html",
    "wallet.html"
)

# Navigation injection code
$navInjection = @'
    <!-- Global Navigation Component -->
    <div id="nav-container"></div>
    <script>
        (function() {
            var navContainer = document.getElementById('nav-container');
            if (navContainer) {
                fetch('navigation-component.html')
                    .then(response => response.text())
                    .then(html => {
                        navContainer.innerHTML = html;
                    })
                    .catch(err => console.error('Navigation load error:', err));
            }
        })();
    </script>
'@

$successCount = 0
$errorCount = 0

foreach ($file in $htmlFiles) {
    $filePath = Join-Path $workspacePath $file
    
    if (Test-Path $filePath) {
        try {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            
            # Check if navigation is already injected
            if ($content -match 'nav-container') {
                Write-Host "SKIPPED: $file (already has navigation)" -ForegroundColor Yellow
                continue
            }
            
            # Find the position to inject (after <body> tag)
            if ($content -match '</head>') {
                # Inject right after </head> and before body content
                $newContent = $content -replace '</head>', "</head>`n$navInjection"
                
                Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
                Write-Host "INJECTED: $file" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "NO HEAD TAG: $file" -ForegroundColor Red
                $errorCount++
            }
        } catch {
            Write-Host "ERROR: $file - $_" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "NOT FOUND: $file" -ForegroundColor Gray
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Navigation Injection Complete!" -ForegroundColor Cyan
Write-Host "Successfully injected: $successCount files" -ForegroundColor Green
Write-Host "Errors/Skipped: $errorCount files" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
