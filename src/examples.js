// GoalImageGallery Usage Examples
// This file demonstrates various ways to use the GoalImageGallery component

import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import GoalImageGallery from '../goal-image-gallery';
import { goalMediaApi } from '../../../api/goal/media/goal-media';
import { useAuth } from '../../../hooks/use-auth';
import { useApp } from '../../../hooks/use-app';

// Example 1: Basic Read-Only Gallery
export const BasicGalleryExample = () => {
  const imageCodes = ['img1', 'img2', 'img3', 'img4'];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Basic Read-Only Gallery
      </Typography>
      <GoalImageGallery
        imageCodes={imageCodes}
        canEdit={false}
        emptyMessage="No images to display"
      />
    </Box>
  );
};

// Example 2: Editable Product Gallery
export const ProductGalleryExample = () => {
  const [productImages, setProductImages] = useState(['prod1', 'prod2']);
  const { currentCompany } = useApp();
  const { hasPermission } = useAuth();

  const handleImageUpload = useCallback(
    async (imageData) => {
      try {
        const response = await goalMediaApi.submitImage({
          values: {
            ...imageData,
            application: 'PRODUCT_GALLERY',
            folder: 'products',
            companyId: currentCompany
          }
        });

        return {
          success: true,
          data: response.data,
          message: 'Product images uploaded successfully'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    [currentCompany]
  );

  const refreshProduct = useCallback((result) => {
    // Refresh product data after upload
    console.log('Product updated:', result);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Product Gallery (Editable)
      </Typography>
      <GoalImageGallery
        imageCodes={productImages}
        canEdit={hasPermission('EDIT_PRODUCTS')}
        ownerEntity={{ id: 'product-123', type: 'product' }}
        imageHandlerApi={handleImageUpload}
        afterUpload={refreshProduct}
        multiple={true}
        emptyMessage="No product images available"
        showImageInfo={true}
        allowDownload={true}
      />
    </Box>
  );
};

// Example 3: User Avatar Gallery
export const UserAvatarExample = () => {
  const [userAvatar, setUserAvatar] = useState('avatar-001');
  const { account } = useAuth();

  const handleAvatarUpload = useCallback(
    async (imageData) => {
      try {
        const response = await goalMediaApi.submitImage({
          values: {
            ...imageData,
            application: 'USER_AVATAR',
            folder: 'avatars',
            owner: account.userName
          }
        });

        return {
          success: true,
          data: response.data,
          message: 'Avatar updated successfully'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    [account]
  );

  const refreshUser = useCallback((result) => {
    setUserAvatar(result.data.code);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        User Avatar (Single Image)
      </Typography>
      <GoalImageGallery
        imageCodes={[userAvatar]}
        canEdit={true}
        ownerEntity={{ id: account.id, type: 'user' }}
        imageHandlerApi={handleAvatarUpload}
        afterUpload={refreshUser}
        multiple={false}
        emptyMessage="No avatar set"
        showImageInfo={false}
      />
    </Box>
  );
};

// Example 4: Document Attachments Gallery
export const DocumentGalleryExample = () => {
  const [documentImages, setDocumentImages] = useState([]);
  const { currentCompany } = useApp();
  const { hasPermission } = useAuth();

  const handleDocumentImageUpload = useCallback(
    async (imageData) => {
      try {
        const response = await goalMediaApi.submitImage({
          values: {
            ...imageData,
            application: 'DOCUMENT_ATTACHMENTS',
            folder: 'documents',
            companyId: currentCompany
          }
        });

        return {
          success: true,
          data: response.data,
          message: 'Document images uploaded successfully'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    [currentCompany]
  );

  const refreshDocument = useCallback((result) => {
    // Update document with new images
    console.log('Document updated:', result);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Document Attachments Gallery
      </Typography>
      <GoalImageGallery
        imageCodes={documentImages}
        canEdit={hasPermission('EDIT_DOCUMENTS')}
        ownerEntity={{ id: 'doc-456', type: 'document' }}
        imageHandlerApi={handleDocumentImageUpload}
        afterUpload={refreshDocument}
        multiple={true}
        permission="EDIT_DOCUMENTS"
        emptyMessage="No document attachments"
        showImageInfo={true}
        allowDownload={true}
      />
    </Box>
  );
};

// Example 5: Gallery with Custom Empty State
export const CustomEmptyStateExample = () => {
  const [images, setImages] = useState([]);

  const handleUpload = useCallback(async (imageData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { code: `img-${Date.now()}` },
          message: 'Image uploaded successfully'
        });
      }, 1000);
    });
  }, []);

  const refreshImages = useCallback((result) => {
    setImages((prev) => [...prev, result.data.code]);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Custom Empty State Gallery
      </Typography>
      <GoalImageGallery
        imageCodes={images}
        canEdit={true}
        ownerEntity={{ id: 'custom-gallery', type: 'gallery' }}
        imageHandlerApi={handleUpload}
        afterUpload={refreshImages}
        multiple={true}
        emptyMessage="Start building your gallery by adding images"
        showImageInfo={true}
      />
    </Box>
  );
};

// Example 6: Gallery with URL and Clipboard Support Demo
export const AdvancedUploadExample = () => {
  const [images, setImages] = useState(['demo1', 'demo2']);

  const handleAdvancedUpload = useCallback(async (imageData) => {
    // Handle different upload methods
    const uploadMethod = imageData.method || 'file';

    console.log(`Uploading via ${uploadMethod}:`, imageData);

    try {
      const response = await goalMediaApi.submitImage({
        values: {
          ...imageData,
          application: 'ADVANCED_GALLERY',
          folder: 'advanced',
          uploadMethod
        }
      });

      return {
        success: true,
        data: response.data,
        message: `Image uploaded successfully via ${uploadMethod}`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }, []);

  const refreshGallery = useCallback((result) => {
    setImages((prev) => [...prev, result.data.code]);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Advanced Upload Methods Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This gallery supports multiple upload methods:
      </Typography>
      <ul>
        <li>File upload: Click "Add Image" or drag & drop</li>
        <li>Clipboard paste: Copy an image and press Ctrl+V</li>
        <li>URL loading: Enter image URLs directly</li>
      </ul>
      <GoalImageGallery
        imageCodes={images}
        canEdit={true}
        ownerEntity={{ id: 'advanced-gallery', type: 'gallery' }}
        imageHandlerApi={handleAdvancedUpload}
        afterUpload={refreshGallery}
        multiple={true}
        emptyMessage="Try all upload methods: file, clipboard, and URL"
        showImageInfo={true}
        allowDownload={true}
      />
    </Box>
  );
};

// Example 7: Mobile-Optimized Gallery
export const MobileGalleryExample = () => {
  const [mobileImages, setMobileImages] = useState(['mobile1', 'mobile2', 'mobile3']);

  const handleMobileUpload = useCallback(async (imageData) => {
    // Optimize for mobile upload
    const compressedData = {
      ...imageData,
      quality: 0.8, // Compress for mobile
      maxWidth: 1200,
      maxHeight: 1200
    };

    try {
      const response = await goalMediaApi.submitImage({
        values: {
          ...compressedData,
          application: 'MOBILE_GALLERY',
          folder: 'mobile'
        }
      });

      return {
        success: true,
        data: response.data,
        message: 'Mobile image uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }, []);

  const refreshMobileGallery = useCallback((result) => {
    setMobileImages((prev) => [...prev, result.data.code]);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mobile-Optimized Gallery
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Optimized for mobile devices with touch-friendly interface
      </Typography>
      <GoalImageGallery
        imageCodes={mobileImages}
        canEdit={true}
        ownerEntity={{ id: 'mobile-gallery', type: 'gallery' }}
        imageHandlerApi={handleMobileUpload}
        afterUpload={refreshMobileGallery}
        multiple={true}
        emptyMessage="Mobile gallery - tap to add images"
        showImageInfo={false}
        allowDownload={false}
      />
    </Box>
  );
};

// Example 8: Full Example with State Management
export const FullExampleWithStateManagement = () => {
  const [galleryState, setGalleryState] = useState({
    images: ['state1', 'state2'],
    loading: false,
    error: null
  });

  const handleStateUpload = useCallback(async (imageData) => {
    setGalleryState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await goalMediaApi.submitImage({
        values: {
          ...imageData,
          application: 'STATE_GALLERY',
          folder: 'state-managed'
        }
      });

      if (response.success) {
        setGalleryState((prev) => ({
          ...prev,
          images: [...prev.images, response.data.code],
          loading: false
        }));

        return {
          success: true,
          data: response.data,
          message: 'Image uploaded and state updated'
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setGalleryState((prev) => ({
        ...prev,
        loading: false,
        error: error.message
      }));

      return {
        success: false,
        message: error.message
      };
    }
  }, []);

  const refreshWithState = useCallback((result) => {
    // State is managed in the upload handler
    console.log('Gallery state updated:', result);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Full Example with State Management
      </Typography>

      {galleryState.error && (
        <Typography color="error" variant="body2" paragraph>
          Error: {galleryState.error}
        </Typography>
      )}

      <GoalImageGallery
        imageCodes={galleryState.images}
        canEdit={true}
        ownerEntity={{ id: 'state-gallery', type: 'gallery' }}
        imageHandlerApi={handleStateUpload}
        afterUpload={refreshWithState}
        multiple={true}
        emptyMessage="State-managed gallery - add images to see state updates"
        showImageInfo={true}
        allowDownload={true}
      />
    </Box>
  );
};

// Complete Demo Component
export const GoalImageGalleryExamples = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        GoalImageGallery Examples
      </Typography>

      <BasicGalleryExample />
      <Divider sx={{ my: 3 }} />

      <ProductGalleryExample />
      <Divider sx={{ my: 3 }} />

      <UserAvatarExample />
      <Divider sx={{ my: 3 }} />

      <DocumentGalleryExample />
      <Divider sx={{ my: 3 }} />

      <CustomEmptyStateExample />
      <Divider sx={{ my: 3 }} />

      <AdvancedUploadExample />
      <Divider sx={{ my: 3 }} />

      <MobileGalleryExample />
      <Divider sx={{ my: 3 }} />

      <FullExampleWithStateManagement />
    </Box>
  );
};

export default GoalImageGalleryExamples;
