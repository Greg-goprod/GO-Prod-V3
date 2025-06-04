/**
 * design-tokens.ts
 * Centralisation des constantes de design pour assurer la cohérence dans toute l'application
 */

// Palette de couleurs
export const colors = {
  // Couleurs primaires
  primary: {
    50: 'var(--color-primary-50, #F5F3FF)',
    100: 'var(--color-primary-100, #EDE9FE)',
    200: 'var(--color-primary-200, #DDD6FE)',
    300: 'var(--color-primary-300, #C4B5FD)',
    400: 'var(--color-primary-400, #A78BFA)',
    500: 'var(--color-primary-500, #8B5CF6)',
    600: 'var(--color-primary-600, #7C3AED)',
    700: 'var(--color-primary-700, #6D28D9)',
    800: 'var(--color-primary-800, #5B21B6)',
    900: 'var(--color-primary-900, #4C1D95)',
  },
  
  // Gris et neutres
  gray: {
    50: 'var(--color-gray-50, #FAFAFA)',
    100: 'var(--color-gray-100, #F3F4F6)',
    200: 'var(--color-gray-200, #E5E7EB)',
    300: 'var(--color-gray-300, #D1D5DB)',
    400: 'var(--color-gray-400, #9CA3AF)',
    500: 'var(--color-gray-500, #6B7280)',
    600: 'var(--color-gray-600, #4B5563)',
    700: 'var(--color-gray-700, #374151)',
    800: 'var(--color-gray-800, #1F2937)',
    900: 'var(--color-gray-900, #111827)',
  },

  // Thème sombre
  dark: {
    50: 'var(--color-dark-50, #FAFAFA)',
    100: 'var(--color-dark-100, #F4F4F5)',
    200: 'var(--color-dark-200, #E4E4E7)',
    300: 'var(--color-dark-300, #D4D4D8)',
    400: 'var(--color-dark-400, #A1A1AA)',
    500: 'var(--color-dark-500, #71717A)',
    600: 'var(--color-dark-600, #52525B)',
    700: 'var(--color-dark-700, #3F3F46)',
    800: 'var(--color-dark-800, #27272A)',
    900: 'var(--color-dark-900, #18181B)',
    950: 'var(--color-dark-950, #09090B)',
  },

  // États sémantiques
  success: {
    50: 'var(--color-success-50, #F0FDF4)',
    100: 'var(--color-success-100, #DCFCE7)',
    500: 'var(--color-success-500, #22C55E)',
    700: 'var(--color-success-700, #15803D)',
    900: 'var(--color-success-900, #14532D)',
  },
  
  warning: {
    50: 'var(--color-warning-50, #FFFBEB)',
    100: 'var(--color-warning-100, #FEF3C7)',
    500: 'var(--color-warning-500, #F59E0B)',
    700: 'var(--color-warning-700, #B45309)',
    900: 'var(--color-warning-900, #78350F)',
  },
  
  error: {
    50: 'var(--color-error-50, #FEF2F2)',
    100: 'var(--color-error-100, #FEE2E2)',
    500: 'var(--color-error-500, #EF4444)',
    700: 'var(--color-error-700, #B91C1C)',
    900: 'var(--color-error-900, #7F1D1D)',
  },

  // Couleurs de base
  white: 'var(--color-white, #FFFFFF)',
  black: 'var(--color-black, #000000)',
};

// Typographie
export const typography = {
  fontFamily: {
    sans: 'var(--font-family-sans, "Roboto", "Helvetica", "Arial", sans-serif)',
  },
  fontSize: {
    xs: 'var(--font-size-xs, 0.65rem)',      // ~10.4px
    sm: 'var(--font-size-sm, 0.75rem)',      // ~12px
    base: 'var(--font-size-base, 0.875rem)', // ~14px
    lg: 'var(--font-size-lg, 0.975rem)',     // ~15.6px
    xl: 'var(--font-size-xl, 1.075rem)',     // ~17.2px
    '2xl': 'var(--font-size-2xl, 1.275rem)', // ~20.4px
  },
  fontWeight: {
    light: 'var(--font-weight-light, 300)',
    normal: 'var(--font-weight-normal, 400)',
    medium: 'var(--font-weight-medium, 500)',
    semibold: 'var(--font-weight-semibold, 600)',
    bold: 'var(--font-weight-bold, 700)',
  },
};

// Espacement
export const spacing = {
  0: '0px',
  0.5: 'var(--spacing-0-5, 0.125rem)', // 2px
  1: 'var(--spacing-1, 0.25rem)',      // 4px
  1.5: 'var(--spacing-1-5, 0.375rem)', // 6px
  2: 'var(--spacing-2, 0.5rem)',       // 8px
  2.5: 'var(--spacing-2-5, 0.625rem)', // 10px
  3: 'var(--spacing-3, 0.75rem)',      // 12px
  3.5: 'var(--spacing-3-5, 0.875rem)', // 14px
  4: 'var(--spacing-4, 1rem)',         // 16px
  5: 'var(--spacing-5, 1.25rem)',      // 20px
  6: 'var(--spacing-6, 1.5rem)',       // 24px
  7: 'var(--spacing-7, 1.75rem)',      // 28px
  8: 'var(--spacing-8, 2rem)',         // 32px
  9: 'var(--spacing-9, 2.25rem)',      // 36px
  10: 'var(--spacing-10, 2.5rem)',     // 40px
  11: 'var(--spacing-11, 2.75rem)',    // 44px
  12: 'var(--spacing-12, 3rem)',       // 48px
  card: 'var(--spacing-card, 0.75rem)', // ~12px (pour les cartes)
  form: 'var(--spacing-form, 0.875rem)', // ~14px (pour les formulaires)
};

// Effets
export const effects = {
  borderRadius: {
    none: '0px',
    sm: 'var(--border-radius-sm, 0.125rem)',   // 2px
    md: 'var(--border-radius-md, 0.25rem)',    // 4px
    lg: 'var(--border-radius-lg, 0.5rem)',     // 8px
    xl: 'var(--border-radius-xl, 0.75rem)',    // 12px
    '2xl': 'var(--border-radius-2xl, 1rem)',   // 16px
    '3xl': 'var(--border-radius-3xl, 1.5rem)', // 24px
    full: 'var(--border-radius-full, 9999px)',
  },
  boxShadow: {
    none: 'none',
    sm: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
    md: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
    lg: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
    card: 'var(--shadow-card, 0 1px 2px rgba(0, 0, 0, 0.05))',
    'card-hover': 'var(--shadow-card-hover, 0 2px 4px rgba(0, 0, 0, 0.05))',
  },
};

// Animations et transitions
export const animations = {
  transition: {
    default: 'var(--transition-default, 150ms cubic-bezier(0.4, 0, 0.2, 1))',
    fast: 'var(--transition-fast, 100ms cubic-bezier(0.4, 0, 0.2, 1))',
    slow: 'var(--transition-slow, 300ms cubic-bezier(0.4, 0, 0.2, 1))',
  },
};

// Types pour les composants
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type InputVariant = 'default' | 'filled' | 'outline'; 