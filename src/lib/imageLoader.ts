/**
 * Utilitaire pour le chargement optimisé des images
 * Fournit des fonctions pour le lazy loading, le préchargement et l'optimisation des images
 */

/**
 * Type d'image avec des dimensions
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Options pour le chargement d'images
 */
export interface ImageLoaderOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  blur?: boolean;
}

/**
 * Fonction pour générer un URL d'image optimisée
 * @param src URL de l'image source
 * @param dimensions Dimensions souhaitées
 * @param options Options d'optimisation
 * @returns URL de l'image optimisée
 */
export const getOptimizedImageUrl = (
  src: string,
  dimensions?: Partial<ImageDimensions>,
  options: ImageLoaderOptions = {}
): string => {
  // Si l'URL est déjà optimisée ou externe, on la retourne telle quelle
  if (src.includes('data:image') || src.startsWith('http') || src.startsWith('blob:')) {
    return src;
  }

  // Construire les paramètres d'URL
  const params = new URLSearchParams();
  
  if (dimensions?.width) {
    params.append('w', dimensions.width.toString());
  }
  
  if (dimensions?.height) {
    params.append('h', dimensions.height.toString());
  }
  
  if (options.quality) {
    params.append('q', options.quality.toString());
  }
  
  if (options.format) {
    params.append('fm', options.format);
  }
  
  if (options.blur) {
    params.append('blur', '50');
  }
  
  // Construire l'URL finale
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
};

/**
 * Préchargement d'une image
 * @param src URL de l'image à précharger
 * @returns Promise résolue lorsque l'image est chargée
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Préchargement d'un ensemble d'images
 * @param srcs Tableau d'URLs d'images à précharger
 * @returns Promise résolue lorsque toutes les images sont chargées
 */
export const preloadImages = (srcs: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(srcs.map(preloadImage));
};

/**
 * Hook de lazy loading pour les images
 * @param targetElement Élément cible (ref React)
 * @param options Options d'observation
 */
export const lazyLoadImage = (
  targetElement: HTMLImageElement | null,
  options: IntersectionObserverInit = {}
): void => {
  if (!targetElement || !window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
  
  observer.observe(targetElement);
}; 