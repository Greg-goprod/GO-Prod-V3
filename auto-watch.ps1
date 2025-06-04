# Script de surveillance et push automatique

# Configuration
$watchInterval = 300  # Intervalle de vérification en secondes (5 minutes par défaut)
$commitMessage = "Mise à jour automatique"

Write-Host "Script de surveillance des modifications GO-PROD-v3" -ForegroundColor Green
Write-Host "Surveillance automatique activée. Intervalle de vérification: $watchInterval secondes" -ForegroundColor Yellow
Write-Host "Appuyez sur CTRL+C pour arrêter la surveillance" -ForegroundColor Yellow
Write-Host ""

# Boucle de surveillance
try {
    while ($true) {
        # Vérifier s'il y a des modifications
        $status = git status --porcelain
        
        if ($status) {
            Write-Host "Modifications détectées à $(Get-Date)" -ForegroundColor Cyan
            
            # Ajouter les modifications
            git add .
            
            # Effectuer le commit
            $dateTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            git commit -m "$commitMessage - $dateTime"
            
            # Récupérer la branche actuelle
            $branch = git rev-parse --abbrev-ref HEAD
            
            # Pousser les modifications
            git push origin $branch
            
            Write-Host "Push terminé avec succès!" -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "Aucune modification détectée à $(Get-Date)" -ForegroundColor Gray
        }
        
        # Attendre avant la prochaine vérification
        Start-Sleep -Seconds $watchInterval
    }
} catch {
    Write-Host "Surveillance arrêtée." -ForegroundColor Red
} 