// GoalImageGallery - Enhanced Image Gallery Component
//
// This is the main entry point for the GoalImageGallery component
// and its related utilities and documentation.

// Main component exports
export { default as GoalImageGallery } from './GoalImageGallery';
export { default } from './GoalImageGallery';

// Legacy component (for backward compatibility)
export { default as LegacyGoalImageGallery } from '../goal-image-gallery';

// Enhanced versions
export { default as EnhancedGoalImageGallery } from '../enhanced-goal-image-gallery';

// Subcomponent exports
export { default as ImageGalleryGrid } from './components/ImageGalleryGrid';
export { default as ImageGalleryModal } from './components/ImageGalleryModal';
export { default as ImageGalleryItem } from './components/ImageGalleryItem';
export { default as ImageGalleryEmptyState } from './components/ImageGalleryEmptyState';

// Hook exports
export {
  useImageGallery,
  useImageZoom,
  useClipboard,
  useKeyboardNavigation
} from './hooks/use-image-gallery';

// Style exports
export {
  StyledImageContainer,
  ImageOverlay,
  StyledModalContainer,
  StyledModalHeader,
  StyledModalBody,
  StyledModalFooter,
  StyledEmptyStateContainer,
  StyledImageGridContainer
} from './styles/styled-components';

// Utility exports
export {
  handleImageError,
  downloadImage,
  processImageCodes,
  getGridColumns,
  isValidImageFile,
  formatFileSize,
  generateId,
  debounce,
  isTouchDevice,
  getImageDimensions,
  createImagePreview
} from './utils/image-utils';
export { EnhancedImageSelector } from '../enhanced-image-selector';

// Examples and documentation
export { default as GoalImageGalleryExamples } from './examples';

// Re-export common components for convenience
export { CommonImageSelector } from '../common-image-selector';

// Component features and capabilities
export const FEATURES = {
  UPLOAD_METHODS: {
    FILE_UPLOAD: 'file',
    CLIPBOARD_PASTE: 'clipboard',
    URL_LOADING: 'url'
  },
  KEYBOARD_SHORTCUTS: {
    NAVIGATE_LEFT: 'ArrowLeft',
    NAVIGATE_RIGHT: 'ArrowRight',
    ZOOM_IN: ['+', '='],
    ZOOM_OUT: '-',
    CLOSE: 'Escape',
    PASTE: 'Ctrl+V'
  },
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  BROWSER_SUPPORT: {
    CHROME: 'full',
    FIREFOX: 'full',
    SAFARI: 'full',
    EDGE: 'full',
    IE11: 'limited'
  }
};

// Utility functions
export const utils = {
  /**
   * Convert image URLs to image codes
   * @param {string} url - Image URL
   * @returns {string} - Image code
   */
  getImageCodeFromUrl: (url) => {
    return url.split('/').pop().split('.')[0];
  },

  /**
   * Validate image file
   * @param {File} file - Image file
   * @param {Object} options - Validation options
   * @returns {Object} - Validation result
   */
  validateImageFile: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = FEATURES.SUPPORTED_FORMATS
    } = options;

    const errors = [];

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Create image handler API wrapper
   * @param {Function} uploadFunction - Upload function
   * @returns {Function} - Wrapped handler
   */
  createImageHandler: (uploadFunction) => {
    return async (imageData) => {
      try {
        const result = await uploadFunction(imageData);
        return {
          success: true,
          data: result,
          message: 'Upload successful'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    };
  },

  /**
   * Convert legacy photo format to image codes
   * @param {Array} photos - Legacy photo array
   * @returns {Array} - Image codes
   */
  convertPhotosToImageCodes: (photos) => {
    return photos.map((photo) => photo.image_code || photo.id || photo.src);
  }
};

// Configuration constants
export const CONFIG = {
  DEFAULT_MAX_FILES: 10,
  DEFAULT_MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  DEFAULT_UPLOAD_FOLDER: 'gallery',
  DEFAULT_ZOOM_LEVELS: {
    MIN: 0.5,
    MAX: 3.0,
    STEP: 0.5
  },
  DEFAULT_BREAKPOINTS: {
    MOBILE: 'md',
    TABLET: 'lg',
    DESKTOP: 'xl'
  }
};

// Export version info
export const VERSION = '2.0.0';
export const CHANGELOG = [
  {
    version: '2.0.0',
    date: '2024-01-01',
    changes: [
      'Added multi-method upload support',
      'Enhanced UI/UX with Material Design 3',
      'Improved accessibility features',
      'Added keyboard navigation',
      'Mobile optimization',
      'Comprehensive documentation'
    ]
  },
  {
    version: '1.0.0',
    date: '2023-12-01',
    changes: [
      'Initial release',
      'Basic image gallery functionality',
      'File upload support',
      'Image viewer modal'
    ]
  }
];
