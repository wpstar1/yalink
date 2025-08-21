@echo off
echo 깃하이라이트 자동 시작 설정을 진행합니다...

:: 필요한 패키지 설치
echo 필요한 패키지를 설치합니다...
pip install -r requirements.txt

:: 시작 프로그램 바로가기 생성
echo 시작 프로그램에 바로가기를 생성합니다...
set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\깃하이라이트.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "cmd.exe" >> %SCRIPT%
echo oLink.Arguments = "/c cd /d %CD% && run.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "%CD%" >> %SCRIPT%
echo oLink.Description = "깃하이라이트 자동 실행" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo 설정이 완료되었습니다!
echo 이제 컴퓨터를 시작할 때마다 깃하이라이트가 자동으로 실행됩니다.
echo.
echo 지금 바로 실행하시겠습니까? (Y/N)
choice /c YN /n
if %errorlevel% equ 1 (
    call run.bat
)
