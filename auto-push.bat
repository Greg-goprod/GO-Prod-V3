@echo off
echo ==========================================================
echo Script de sauvegarde automatique du projet sur GitHub
echo ==========================================================

REM Ajouter tous les fichiers modifiés
git add .

REM Demander un message de commit
set /p COMMIT_MSG="Message de commit (ou appuyez sur Entrée pour un message par défaut): "

REM Utiliser un message par défaut si aucun message n'est fourni
if "%COMMIT_MSG%"=="" set COMMIT_MSG="Mise à jour automatique - %date% %time%"

REM Effectuer le commit
git commit -m "%COMMIT_MSG%"

REM Récupérer la branche actuelle
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%a

REM Pousser les modifications
git push origin %BRANCH%

echo.
echo Terminé! Les modifications ont été envoyées vers GitHub.
echo.

pause 