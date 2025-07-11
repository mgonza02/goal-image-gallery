import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ImageGalleryGrid from './components/ImageGalleryGrid';
import ImageGalleryModal from './components/ImageGalleryModal';
import {
  useImageGallery,
  useImageZoom,
  useClipboard,
  useKeyboardNavigation
} from './hooks/use-image-gallery';
import { downloadImage } from './utils/image-utils';

/**
 * Enhanced GoalImageGallery Component
 *
 * This component provides a modern, accessible image gallery with advanced upload capabilities.
 *
 * Key Features:
 * - Multi-method image upload (file selection, clipboard paste, URL loading)
 * - Responsive grid layout with hover effects
 * - Full-screen image viewer with zoom controls
 * - Keyboard navigation support
 * - Drag and drop functionality
 * - Mobile-friendly interface
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Loading states and error handling
 *
 * Upload Methods:
 * 1. File Upload: Click to select or drag and drop image files
 * 2. Clipboard Paste: Use Ctrl+V to paste images from clipboard
 * 3. URL Loading: Enter image URLs to load remote images
 *
 * Keyboard Shortcuts (when image is open):
 * - Arrow Left/Right: Navigate between images
 * - +/=: Zoom in
 * - -: Zoom out
 * - Escape: Close image viewer
 *
 * Props:
 * - canEdit: Enable editing capabilities
 * - ownerEntity: Entity that owns the images
 * - imageHandlerApi: API function for image operations
 * - afterUpload: Callback after successful upload
 * - imageCodes: Array or string of image codes
 * - multiple: Allow multiple image selection
 * - permission: Required permission for editing
 * - emptyMessage: Message shown when no images
 * - showImageInfo: Show image information overlay
 * - allowDownload: Enable download functionality
 * - getImageUrl: Function to get image URL from code
 * - noImageUrl: Fallback image URL
 * - showError: Function to show error messages
 * - hasPermission: Function to check user permissions
 */
const GoalImageGallery = ({
  canEdit = false,
  ownerEntity,
  imageHandlerApi,
  afterUpload: onRefresh,
  imageCodes,
  multiple = false,
  permission,
  emptyMessage = 'No hay imágenes para mostrar',
  showImageInfo = false,
  allowDownload = false,
  getImageUrl = ({ imageCode }) => `/images/${imageCode}`,
  noImageUrl = '/images/no-image.png',
  showError = (message) => console.error(message),
  hasPermission = () => true,
  currentCompany = 'default'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [updatable, setUpdatable] = useState(false);

  // Initialize permissions
  useEffect(() => {
    const isAllowed = !permission || hasPermission(permission);
    setUpdatable(!!(isAllowed && canEdit && imageHandlerApi && ownerEntity));
  }, [canEdit, ownerEntity, permission, hasPermission, imageHandlerApi]);

  // Main gallery state and handlers
  const {
    openImage,
    selectedImageIndex,
    selectingImage,
    imageList,
    selectedImage,
    zoomLevel,
    loading,
    removable,
    setZoomLevel,
    handleOpenImage,
    handleCloseImage,
    handleImageSelect,
    handleCancel,
    handleRemoveImage,
    handleAfterUpload
  } = useImageGallery({
    imageCodes,
    multiple,
    canEdit,
    updatable,
    imageHandlerApi,
    ownerEntity,
    currentCompany,
    onRefresh,
    showError
  });

  // Zoom and navigation handlers
  const { handleZoomIn, handleZoomOut, handlePreviousImage, handleNextImage } = useImageZoom(
    getImageUrl,
    imageList
  );

  // Enhanced zoom handlers that update the main state
  const handleZoomInEnhanced = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOutEnhanced = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handlePreviousImageEnhanced = () => {
    const newImageUrl = handlePreviousImage();
    handleOpenImage(
      newImageUrl,
      selectedImageIndex > 0 ? selectedImageIndex - 1 : imageList.length - 1
    );
  };

  const handleNextImageEnhanced = () => {
    const newImageUrl = handleNextImage();
    handleOpenImage(
      newImageUrl,
      selectedImageIndex < imageList.length - 1 ? selectedImageIndex + 1 : 0
    );
  };

  // Download handler
  const handleDownloadImage = (imageCode) => {
    const imageUrl = getImageUrl({ imageCode });
    downloadImage(imageUrl, imageCode);
  };

  // Clipboard paste handler
  const handlePasteImage = (file) => {
    handleImageSelect(null);
    setTimeout(() => {
      const event = new CustomEvent('pasteImage', { detail: { file } });
      window.dispatchEvent(event);
    }, 100);
  };

  // Clipboard support
  const { clipboardSupported } = useClipboard(updatable, selectingImage, handlePasteImage);

  // Keyboard navigation
  useKeyboardNavigation(
    openImage,
    handlePreviousImageEnhanced,
    handleNextImageEnhanced,
    handleCloseImage,
    handleZoomInEnhanced,
    handleZoomOutEnhanced
  );

  // Show image selector if needed
  if (updatable && (selectingImage || !imageList || imageList.length === 0)) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px dashed #ccc', 
        textAlign: 'center', 
        borderRadius: '8px',
        backgroundColor: '#f5f5f5'
      }}>
        <p>{multiple ? 'Seleccionar Imágenes' : 'Seleccionar Imagen'}</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {multiple
            ? 'Arrastra imágenes aquí o haz clic para seleccionar'
            : 'Arrastra una imagen aquí o haz clic para seleccionar'}
        </p>
        <button onClick={handleCancel} style={{ marginTop: '10px' }}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <>
      <ImageGalleryGrid
        imageList={imageList}
        emptyMessage={emptyMessage}
        multiple={multiple}
        updatable={updatable}
        removable={removable}
        allowDownload={allowDownload}
        showImageInfo={showImageInfo}
        loading={loading}
        clipboardSupported={clipboardSupported}
        getImageUrl={getImageUrl}
        noImageUrl={noImageUrl}
        onImageClick={handleOpenImage}
        onImageSelect={handleImageSelect}
        onRemoveImage={handleRemoveImage}
        onDownloadImage={handleDownloadImage}
      />

      <ImageGalleryModal
        open={openImage !== null}
        imageUrl={openImage}
        imageList={imageList}
        selectedImageIndex={selectedImageIndex}
        zoomLevel={zoomLevel}
        noImageUrl={noImageUrl}
        onClose={handleCloseImage}
        onZoomIn={handleZoomInEnhanced}
        onZoomOut={handleZoomOutEnhanced}
        onPreviousImage={handlePreviousImageEnhanced}
        onNextImage={handleNextImageEnhanced}
      />
    </>
  );
};

GoalImageGallery.propTypes = {
  canEdit: PropTypes.bool,
  ownerEntity: PropTypes.object,
  imageHandlerApi: PropTypes.func,
  afterUpload: PropTypes.func,
  imageCodes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  multiple: PropTypes.bool,
  permission: PropTypes.string,
  emptyMessage: PropTypes.string,
  showImageInfo: PropTypes.bool,
  allowDownload: PropTypes.bool,
  getImageUrl: PropTypes.func,
  noImageUrl: PropTypes.string,
  showError: PropTypes.func,
  hasPermission: PropTypes.func,
  currentCompany: PropTypes.string
};

export default GoalImageGallery;
