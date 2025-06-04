# Bibliothèque de Composants UI pour GO-PROD v3

Cette bibliothèque fournit un ensemble de composants UI standardisés pour GO-PROD v3. Elle permet une cohérence visuelle à travers l'application et facilite le développement de nouvelles fonctionnalités.

## Design Tokens

Les composants sont basés sur un système de design tokens défini dans `src/lib/design-tokens.ts`. Ces tokens incluent :

- Couleurs (primaire, success, warning, error, etc.)
- Tailles (xs, sm, md, lg, xl)
- Variantes (default, outline, ghost, etc.)
- Effets (ombres, transitions, etc.)

## Composants disponibles

### Composants de base
- **Alert** - Affiche des messages informatifs, de succès, d'avertissement ou d'erreur
- **Badge** - Étiquette pour afficher un statut ou une catégorie
- **Button** - Bouton avec différentes variantes et tailles
- **Card** - Conteneur pour regrouper des informations liées
- **Input** - Champ de saisie pour texte, nombre, etc.

### Formulaires et sélection
- **Select** - Liste déroulante pour sélectionner parmi plusieurs options
- **Switch** - Interrupteur pour les options booléennes (on/off)
- **Combobox** - Champ de saisie avec suggestions
- **DatePicker** - Sélecteur de date
- **DateTimePicker** - Sélecteur de date et heure
- **FormAccordion** - Organisateur de formulaire en sections dépliables
- **FormLayout** - Structure pour les formulaires

### Modals et dialogs
- **Dialog** - Fenêtre modale basée sur Radix UI
- **Modal** - Alternative plus simple au Dialog

### Composants auxiliaires
- **Calendar** - Calendrier utilisé par DatePicker et DateTimePicker
- **Popover** - Popover utilisé par divers composants

## Principes de conception

1. **Accessibilité** - Les composants suivent les bonnes pratiques WCAG et fournissent des attributs ARIA appropriés
2. **Mode sombre** - Tous les composants supportent le mode clair et sombre
3. **Responsive** - Les composants s'adaptent à différentes tailles d'écran
4. **Personnalisation** - Les styles peuvent être étendus via `className` et d'autres props

## Utilisation

Importez les composants depuis un emplacement central :

```tsx
import { Button, Input, Card } from '../components/ui';

function MyComponent() {
  return (
    <Card>
      <h2>Formulaire</h2>
      <Input 
        label="Nom" 
        placeholder="Entrez votre nom"
        fullWidth 
      />
      <Button variant="primary">Soumettre</Button>
    </Card>
  );
}
```

## Extension

Pour ajouter un nouveau composant à la bibliothèque :

1. Créer un fichier pour le composant dans `src/components/ui/`
2. Implémenter le composant en suivant les conventions de style et d'API
3. Ajouter des exports dans `src/components/ui/index.ts`
4. Documenter le composant dans ce README

## Prochaines améliorations

- Ajout de tests unitaires pour chaque composant
- Création d'une documentation interactives (Storybook)
- Expansion de la bibliothèque avec plus de composants 