/**
 * Image gallery utility functions
 */

/**
 * Handle image errors with fallback logic
 */
export const handleImageError = (e, noImageUrl) => {
  if (e.target.src.includes(noImageUrl)) {
    e.target.src = '/static/images/pic-share-logo.png';
  } else {
    e.target.onerror = null;
    e.target.src = noImageUrl;
  }
};

/**
 * Download image from URL
 */
export const downloadImage = (imageUrl, imageCode) => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `image-${imageCode}.jpg`;
  link.click();
};

/**
 * Process image codes into standardized format
 */
export const processImageCodes = imageCodes => {
  if (!imageCodes) return [];

  const splitedImages = Array.isArray(imageCodes) ? imageCodes : imageCodes.split(/[\s,]+/);
  return splitedImages.map((image_code, index) => ({
    id: index,
    width: 1,
    height: 1,
    title: 'Goal Image',
    image_code,
  }));
};

/**
 * Get responsive grid columns based on screen size and multiple flag
 */
export const getGridColumns = (isMobile, isTablet, multiple) => {
  if (isMobile) return 6; // 2 columns on mobile
  if (isTablet) return multiple ? 4 : 6; // 3 or 2 columns on tablet
  return multiple ? 3 : 4; // 4 or 3 columns on desktop
};

/**
 * Validate image file type
 */
export const isValidImageFile = file => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Format file size for display
 */
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate unique ID for components
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if device supports touch
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get image dimensions from URL
 */
export const getImageDimensions = url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Create image preview from file
 */
export const createImagePreview = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
