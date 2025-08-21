# 관리자 권한 체크
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "관리자 권한이 필요합니다. 관리자 권한으로 다시 실행해주세요."
    exit
}

# 필요한 패키지 설치
Write-Host "필요한 패키지를 설치합니다..." -ForegroundColor Green
pip install -r requirements.txt

# 자동 실행을 위한 바로가기 생성
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\깃하이라이트 시작.lnk")
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -NoProfile -Command `"cd '$PWD'; .\run.bat`""
$Shortcut.WorkingDirectory = $PWD
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Save()

Write-Host "설정이 완료되었습니다!" -ForegroundColor Green
Write-Host "이제 바탕화면의 '깃하이라이트 시작' 아이콘을 클릭하면 자동으로 실행됩니다." -ForegroundColor Green
