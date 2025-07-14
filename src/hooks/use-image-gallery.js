import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for managing image gallery state
 */
export const useImageGallery = ({
  imageCodes,
  multiple,
  canEdit,
  updatable,
  imageHandlerApi,
  ownerEntity,
  currentCompany,
  onRefresh,
  showError
}) => {
  const [openImage, setOpenImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectingImage, setSelectingImage] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [removable, setRemovable] = useState(false);

  // Process image codes into image list
  useEffect(() => {
    const splitedImages = Array.isArray(imageCodes) ? imageCodes : imageCodes?.split(/[\s,]+/);
    let newList = [];

    if (splitedImages) {
      const list = splitedImages.map((image_code, index) => ({
        id: index,
        width: 1,
        height: 1,
        title: 'Goal Image',
        image_code
      }));
      newList = [...list];
    } else {
      newList = [];
    }

    setRemovable(multiple && newList.length > 1);

    // Add plus button for multiple mode
    if (updatable && multiple) {
      newList.push({ image_code: '+', id: newList.length });
    }

    setImageList(newList);
  }, [imageCodes, canEdit, multiple, updatable]);

  // Image handlers
  const handleOpenImage = useCallback((imageUrl, index = 0) => {
    setOpenImage(imageUrl);
    setSelectedImageIndex(index);
    setZoomLevel(1);
  }, []);

  const handleCloseImage = useCallback(() => {
    setOpenImage(null);
    setZoomLevel(1);
  }, []);

  const handleImageSelect = useCallback((image) => {
    setSelectedImage(image);
    setSelectingImage(true);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectingImage(false);
  }, []);

  const handleRemoveImage = useCallback(
    async (image) => {
      setLoading(true);
      try {
        const imagesToSave = imageList.reduce((acc, img) => {
          if (img.image_code !== '+' && img.image_code !== image.image_code) {
            acc.push(img.image_code);
          }
          return acc;
        }, []);

        const result = await imageHandlerApi({
          ...ownerEntity,
          companyId: currentCompany,
          image_code: imagesToSave,
          company_id: currentCompany
        });
        if (result.success) {
          onRefresh?.(result);
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError(error.message || 'Error al eliminar la imagen');
      } finally {
        setLoading(false);
      }
    },
    [ownerEntity, currentCompany, imageList, onRefresh, showError, imageHandlerApi]
  );

  const handleAfterUpload = useCallback(
    async (image) => {
      const currentImageCode = selectedImage?.image_code || '';
      const imagesToSave = imageList.reduce((acc, img) => {
        if (img.image_code !== '+') {
          acc.push(img.image_code === currentImageCode ? image.code : img.image_code);
        }
        return acc;
      }, []);

      if (!currentImageCode) {
        imagesToSave.push(image.code);
      }

      const result = await imageHandlerApi({
        ...ownerEntity,
        companyId: currentCompany,
        image_code: imagesToSave,
        company_id: currentCompany
      });

      if (result.success) {
        setSelectingImage(false);
        onRefresh?.(result);
      } else {
        showError(result.message);
      }
    },
    [ownerEntity, currentCompany, imageList, selectedImage, imageHandlerApi, onRefresh, showError]
  );

  return {
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
  };
};

/**
 * Custom hook for managing image zoom functionality
 */
export const useImageZoom = (getImageUrl, imageList) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  }, []);

  const handlePreviousImage = useCallback(() => {
    const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : imageList.length - 1;
    setSelectedImageIndex(newIndex);
    setZoomLevel(1);
    return getImageUrl({ imageCode: imageList[newIndex].image_code });
  }, [selectedImageIndex, imageList, getImageUrl]);

  const handleNextImage = useCallback(() => {
    const newIndex = selectedImageIndex < imageList.length - 1 ? selectedImageIndex + 1 : 0;
    setSelectedImageIndex(newIndex);
    setZoomLevel(1);
    return getImageUrl({ imageCode: imageList[newIndex].image_code });
  }, [selectedImageIndex, imageList, getImageUrl]);

  return {
    zoomLevel,
    selectedImageIndex,
    setZoomLevel,
    setSelectedImageIndex,
    handleZoomIn,
    handleZoomOut,
    handlePreviousImage,
    handleNextImage
  };
};

/**
 * Custom hook for clipboard functionality
 */
export const useClipboard = (updatable, selectingImage, onPasteImage) => {
  const [clipboardSupported, setClipboardSupported] = useState(false);

  useEffect(() => {
    setClipboardSupported(!!navigator.clipboard);
  }, []);

  useEffect(() => {
    const handlePaste = async (event) => {
      if (!clipboardSupported || !updatable || selectingImage) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            onPasteImage?.(file);
          }
        }
      }
    };

    if (clipboardSupported && updatable) {
      document.addEventListener('paste', handlePaste);
      return () => document.removeEventListener('paste', handlePaste);
    }
  }, [clipboardSupported, updatable, selectingImage, onPasteImage]);

  return { clipboardSupported };
};

/**
 * Custom hook for keyboard navigation
 */
export const useKeyboardNavigation = (
  openImage,
  onPreviousImage,
  onNextImage,
  onCloseImage,
  onZoomIn,
  onZoomOut
) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (openImage !== null) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            onPreviousImage();
            break;
          case 'ArrowRight':
            event.preventDefault();
            onNextImage();
            break;
          case 'Escape':
            event.preventDefault();
            onCloseImage();
            break;
          case '+':
          case '=':
            event.preventDefault();
            onZoomIn();
            break;
          case '-':
            event.preventDefault();
            onZoomOut();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openImage, onPreviousImage, onNextImage, onCloseImage, onZoomIn, onZoomOut]);
};
