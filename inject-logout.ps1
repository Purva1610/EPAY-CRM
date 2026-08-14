# Inject logout button to all HTML files

$folder = "c:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"

$logout = '    <!-- LOGOUT BUTTON & TIMER -->
    <div id="logout-button-container" style="position:fixed;top:15px;right:15px;z-index:99999">
        <button id="logout-btn" class="crm-logout-btn" onclick="handleCRMLogout()" title="Logout">
            <span id="session-timer-display" style="font-size:12px;display:block;margin-bottom:4px">00:00:00</span>
            <span>Logout</span>
        </button>
    </div>
    <style>
    .crm-logout-btn{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;padding:10px 16px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:all 0.3s ease;text-align:center;min-width:80px}
    .crm-logout-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(102,126,234,0.6)}
    .crm-logout-btn:active{transform:translateY(0)}
    .crm-logout-btn:disabled{opacity:0.6;cursor:not-allowed}
    </style>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"><\/script>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js"><\/script>
    <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"><\/script>
    <script src="session-timer-service.js"><\/script>
    <script src="email-service.js"><\/script>
    <script src="calling-service.js"><\/script>
    <script src="firebase-init.js"><\/script>
    <script>function handleCRMLogout(){const btn=document.getElementById("logout-btn");btn.disabled=true;btn.textContent="Logging out...";try{if(typeof firebase==="undefined"){window.location.href="/login.html";return}const auth=firebase.auth(),user=auth.currentUser;if(!user){window.location.href="/login.html";return}let activeTime=0;typeof window.sessionTimerService!=="undefined"&&window.sessionTimerService.getActiveTime&&(activeTime=window.sessionTimerService.getActiveTime()),typeof window.emailService!=="undefined"&&window.emailService.sendLogoutNotification?window.emailService.sendLogoutNotification(user,activeTime).then(()=>{performLogout(auth)}).catch(()=>{performLogout(auth)}):performLogout(auth)}catch(e){console.error(e),btn.disabled=false,btn.textContent="Logout"}}function performLogout(auth){auth.signOut().then(()=>{window.location.href="/login.html"}).catch(()=>{window.location.href="/login.html"})}function updateTimer(){const timerDisplay=document.getElementById("session-timer-display");timerDisplay&&typeof window.sessionTimerService!=="undefined"&&window.sessionTimerService.getFormattedActiveTime&&(timerDisplay.textContent=window.sessionTimerService.getFormattedActiveTime())}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setInterval(updateTimer,1000)}):setInterval(updateTimer,1000)<\/script>'

$files = Get-ChildItem "$folder/*.html" | Where-Object { $_.Name -notmatch "(logout-button|auth-service.test|deepseek)" }

$success = 0
foreach ($file in $files) {
    try {
        $content = [IO.File]::ReadAllText($file.FullName, [Text.Encoding]::UTF8)
        if ($content -notmatch "logout-button-container" -and $content -match "</body>") {
            $newContent = $content -replace "</body>", ($logout + "`n</body>")
            [IO.File]::WriteAllText($file.FullName, $newContent, [Text.Encoding]::UTF8)
            Write-Host "✅ $($file.Name)"
            $success++
        }
    }
    catch { Write-Host "❌ $($file.Name)" }
}
Write-Host "`n✅ Updated $success/$($files.Count) files"
