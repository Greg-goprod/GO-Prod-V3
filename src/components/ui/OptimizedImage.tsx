import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedImageUrl, lazyLoadImage, ImageDimensions, ImageLoaderOptions } from '../../lib/imageLoader';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  dimensions?: Partial<ImageDimensions>;
  loadingStrategy?: 'eager' | 'lazy' | 'progressive';
  options?: ImageLoaderOptions;
  fallbackSrc?: string;
}

/**
 * Composant d'image optimisé avec lazy loading, chargement progressif et fallback
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  dimensions,
  loadingStrategy = 'lazy',
  options = {},
  fallbackSrc = '/images/placeholder.jpg',
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Optimiser l'URL de l'image
  const optimizedSrc = getOptimizedImageUrl(src, dimensions, options);
  const lowQualitySrc = loadingStrategy === 'progressive' 
    ? getOptimizedImageUrl(src, dimensions, { ...options, quality: 10, blur: true }) 
    : undefined;
  
  // Configurer le lazy loading
  useEffect(() => {
    if (loadingStrategy === 'lazy' && imgRef.current) {
      lazyLoadImage(imgRef.current);
    }
  }, [loadingStrategy]);
  
  // Gérer le chargement et les erreurs
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  const handleError = () => {
    setHasError(true);
  };
  
  // Déterminer la source à afficher
  const displaySrc = hasError ? fallbackSrc : 
                    loadingStrategy === 'progressive' && !isLoaded ? lowQualitySrc : 
                    loadingStrategy === 'lazy' ? undefined : optimizedSrc;
  
  // Classes pour les effets visuels
  const imageClasses = [
    className,
    isLoaded ? 'opacity-100' : 'opacity-0',
    'transition-opacity duration-300',
  ].filter(Boolean).join(' ');
  
  return (
    <div className="relative overflow-hidden">
      {loadingStrategy === 'progressive' && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105"
          aria-hidden="true"
        />
      )}
      
      <img
        ref={imgRef}
        src={displaySrc}
        data-src={loadingStrategy === 'lazy' ? optimizedSrc : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={loadingStrategy === 'eager' ? 'eager' : 'lazy'}
        className={imageClasses}
        {...props}
      />
    </div>
  );
}; 