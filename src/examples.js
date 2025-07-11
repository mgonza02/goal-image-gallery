// GoalImageGallery Usage Examples
// This file demonstrates various ways to use the GoalImageGallery component

import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import GoalImageGallery from './GoalImageGallery';

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
  const currentCompany = 'default-company';
  const hasPermission = (perm) => true; // Mock permission check

  const handleImageUpload = useCallback(
    async (imageData) => {
      try {
        // Mock API call
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: { code: `img-${Date.now()}` },
              message: 'Product images uploaded successfully'
            });
          }, 1000);
        });

        return response;
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
        hasPermission={hasPermission}
        currentCompany={currentCompany}
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

// Example: Custom Image Selector with Slots
export const CustomSelectorExample = () => {
  const [images, setImages] = useState(['custom1', 'custom2']);

  // Custom Image Selector Component
  const CustomImageSelector = ({ 
    afterUpload, 
    activate, 
    onCancel, 
    multiple, 
    title, 
    uploadMessage,
    maxFileSize,
    customStyles,
    theme = 'blue'
  }) => {
    const [dragOver, setDragOver] = useState(false);
    
    const handleFileSelect = async (files) => {
      const fileArray = Array.from(files);
      
      // Simulate upload process
      for (const file of fileArray) {
        if (file.size > maxFileSize) {
          alert(`File ${file.name} is too large. Maximum size: ${maxFileSize / 1024 / 1024}MB`);
          continue;
        }
        
        // Simulate API call
        const result = {
          success: true,
          data: { code: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
          message: 'Image uploaded successfully'
        };
        
        afterUpload(result);
      }
    };

    const themeColors = {
      blue: { primary: '#007bff', secondary: '#e3f2fd' },
      green: { primary: '#28a745', secondary: '#e8f5e8' },
      purple: { primary: '#6f42c1', secondary: '#f3e5f5' }
    };

    const currentTheme = themeColors[theme] || themeColors.blue;

    return (
      <Box
        sx={{
          ...customStyles,
          border: `2px dashed ${dragOver ? currentTheme.primary : '#ccc'}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          backgroundColor: dragOver ? currentTheme.secondary : '#f8f9fa',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative'
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <Typography variant="h5" gutterBottom color={currentTheme.primary}>
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {uploadMessage}
        </Typography>
        
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
          Maximum file size: {maxFileSize / 1024 / 1024}MB | Theme: {theme}
        </Typography>
        
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />
        
        <Button 
          variant="contained" 
          sx={{ 
            mr: 2, 
            backgroundColor: currentTheme.primary,
            '&:hover': { backgroundColor: currentTheme.primary, opacity: 0.8 }
          }}
        >
          Choose Files
        </Button>
        
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    );
  };

  const handleCustomUpload = useCallback(async (imageData) => {
    console.log('Custom upload data:', imageData);
    
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: imageData.data,
          message: 'Custom upload successful'
        });
      }, 500);
    });
  }, []);

  const refreshCustomGallery = useCallback((result) => {
    setImages(prev => [...prev, result.data.code]);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Custom Image Selector with Slots
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This example demonstrates how to use the slot system to provide a custom image selector with enhanced UI and functionality.
      </Typography>
      
      <GoalImageGallery
        imageCodes={images}
        canEdit={true}
        ownerEntity={{ id: 'custom-selector-gallery', type: 'gallery' }}
        imageHandlerApi={handleCustomUpload}
        afterUpload={refreshCustomGallery}
        multiple={true}
        emptyMessage="Custom selector gallery - upload with style!"
        showImageInfo={true}
        allowDownload={true}
        slot={{
          selector: CustomImageSelector
        }}
        slotProps={{
          selector: {
            maxFileSize: 5 * 1024 * 1024, // 5MB
            theme: 'blue',
            customStyles: {
              minHeight: '200px',
              margin: '20px 0'
            }
          }
        }}
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
      <Divider sx={{ my: 3 }} />

      <CustomSelectorExample />
    </Box>
  );
};

export default GoalImageGalleryExamples;
