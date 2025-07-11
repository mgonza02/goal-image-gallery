# GoalImageGallery Implementation Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Implementation](#basic-implementation)
3. [Advanced Configuration](#advanced-configuration)
4. [API Integration](#api-integration)
5. [Customization](#customization)
6. [Performance Optimization](#performance-optimization)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Quick Start

### Installation

```bash
# Install the package
npm install @mgonza02/goal-image-gallery

# Install peer dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom
```

### Basic Usage

```javascript
import React from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

const App = () => {
  return (
    <GoalImageGallery
      imageCodes={['img1', 'img2', 'img3']}
      canEdit={false}
    />
  );
};

export default App;
```

## Basic Implementation

### 1. Read-Only Gallery

Perfect for displaying images without editing capabilities:

```javascript
import React from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

const ProductImages = ({ product }) => {
  return (
    <GoalImageGallery
      imageCodes={product.images}
      canEdit={false}
      emptyMessage="No product images available"
      showImageInfo={true}
      allowDownload={true}
      getImageUrl={({ imageCode }) => `https://api.example.com/products/images/${imageCode}`}
      noImageUrl="https://api.example.com/images/no-image.png"
    />
  );
};
```

### 2. Editable Gallery

Basic editable gallery with upload capabilities:

```javascript
import React, { useState } from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

const EditableGallery = ({ initialImages, productId }) => {
  const [images, setImages] = useState(initialImages);

  const handleImageUpload = async (imageData) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: imageData.formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          data: result.images,
          message: 'Upload successful'
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  const handleAfterUpload = (result) => {
    setImages(prev => [...prev, ...result.data.map(img => img.code)]);
  };

  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={true}
      ownerEntity={{ id: productId, type: 'product' }}
      imageHandlerApi={handleImageUpload}
      afterUpload={handleAfterUpload}
      multiple={true}
      emptyMessage="No images yet. Add some!"
    />
  );
};
```

## Advanced Configuration

### 1. Full-Featured Gallery

```javascript
import React, { useState, useCallback } from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';
import { useAuth } from './hooks/useAuth';
import { toast } from 'react-toastify';

const AdvancedGallery = ({ entity, entityType }) => {
  const [images, setImages] = useState(entity.images || []);
  const { user, hasPermission } = useAuth();

  const handleImageUpload = useCallback(async (imageData) => {
    try {
      // Validate files
      const validFiles = imageData.files.filter(file => {
        if (file.size > 25 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 25MB)`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        return {
          success: false,
          message: 'No valid files to upload'
        };
      }

      // Create form data
      const formData = new FormData();
      validFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      formData.append('entityId', entity.id);
      formData.append('entityType', entityType);
      formData.append('companyId', user.companyId);

      // Upload with progress
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return {
        success: true,
        data: result.images,
        message: `${result.images.length} image(s) uploaded successfully`
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: error.message || 'Upload failed'
      };
    }
  }, [entity.id, entityType, user]);

  const handleAfterUpload = useCallback((result) => {
    setImages(prev => [...prev, ...result.data.map(img => img.code)]);
    toast.success(result.message);
  }, []);

  const handleShowError = useCallback((message) => {
    toast.error(message);
  }, []);

  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={hasPermission('EDIT_IMAGES')}
      ownerEntity={{ id: entity.id, type: entityType }}
      imageHandlerApi={handleImageUpload}
      afterUpload={handleAfterUpload}
      multiple={true}
      permission="EDIT_IMAGES"
      emptyMessage={`No ${entityType} images available`}
      showImageInfo={true}
      allowDownload={true}
      getImageUrl={({ imageCode, thumbMail }) => 
        `https://api.example.com/images/${imageCode}${thumbMail ? '?thumb=true' : ''}`
      }
      noImageUrl="https://api.example.com/images/placeholder.png"
      showError={handleShowError}
      hasPermission={hasPermission}
      currentCompany={user.companyId}
    />
  );
};
```

### 2. Permission-Based Gallery

```javascript
import React from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';
import { usePermissions } from './hooks/usePermissions';

const PermissionBasedGallery = ({ images, entityId, entityType }) => {
  const { hasPermission, user } = usePermissions();

  const canEdit = hasPermission('EDIT_IMAGES') || hasPermission(`EDIT_${entityType.toUpperCase()}`);
  const canView = hasPermission('VIEW_IMAGES') || hasPermission(`VIEW_${entityType.toUpperCase()}`);

  if (!canView) {
    return <div>You don't have permission to view these images.</div>;
  }

  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={canEdit}
      ownerEntity={{ id: entityId, type: entityType }}
      imageHandlerApi={canEdit ? handleImageUpload : undefined}
      afterUpload={canEdit ? handleAfterUpload : undefined}
      multiple={true}
      permission={`EDIT_${entityType.toUpperCase()}`}
      hasPermission={hasPermission}
      currentCompany={user.companyId}
      emptyMessage={canEdit ? "No images. Add some!" : "No images available"}
      allowDownload={hasPermission('DOWNLOAD_IMAGES')}
    />
  );
};
```

## API Integration

### 1. REST API Integration

```javascript
class ImageAPI {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async uploadImages(files, metadata) {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${this.baseURL}/images/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteImage(imageCode) {
    const response = await fetch(`${this.baseURL}/images/${imageCode}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Usage
const api = new ImageAPI('https://api.example.com', userToken);

const handleImageUpload = async (imageData) => {
  try {
    const result = await api.uploadImages(imageData.files, {
      entityId: imageData.metadata.entityId,
      entityType: imageData.metadata.entityType,
      companyId: imageData.metadata.companyId
    });

    return {
      success: true,
      data: result.images,
      message: 'Upload successful'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
```

### 2. GraphQL Integration

```javascript
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const UPLOAD_IMAGES = gql`
  mutation UploadImages($files: [Upload!]!, $input: ImageUploadInput!) {
    uploadImages(files: $files, input: $input) {
      success
      message
      images {
        id
        code
        url
        thumbnailUrl
        filename
        size
        width
        height
        createdAt
      }
    }
  }
`;

const DELETE_IMAGE = gql`
  mutation DeleteImage($imageCode: String!) {
    deleteImage(imageCode: $imageCode) {
      success
      message
    }
  }
`;

const GraphQLImageGallery = ({ entityId, entityType, images }) => {
  const [uploadImages] = useMutation(UPLOAD_IMAGES);
  const [deleteImage] = useMutation(DELETE_IMAGE);

  const handleImageUpload = async (imageData) => {
    try {
      const { data } = await uploadImages({
        variables: {
          files: imageData.files,
          input: {
            entityId,
            entityType,
            companyId: imageData.metadata.companyId
          }
        }
      });

      if (data.uploadImages.success) {
        return {
          success: true,
          data: data.uploadImages.images,
          message: data.uploadImages.message
        };
      } else {
        throw new Error(data.uploadImages.message);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={true}
      ownerEntity={{ id: entityId, type: entityType }}
      imageHandlerApi={handleImageUpload}
      multiple={true}
    />
  );
};
```

### 3. Firebase Integration

```javascript
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';

const FirebaseImageGallery = ({ entityId, entityType, images }) => {
  const handleImageUpload = async (imageData) => {
    try {
      const uploadPromises = imageData.files.map(async (file) => {
        const filename = `${entityType}/${entityId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filename);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          id: snapshot.ref.fullPath,
          code: snapshot.ref.name,
          url: downloadURL,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          width: 0, // You might want to get actual dimensions
          height: 0,
          createdAt: new Date().toISOString()
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      return {
        success: true,
        data: uploadedImages,
        message: 'Images uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={true}
      ownerEntity={{ id: entityId, type: entityType }}
      imageHandlerApi={handleImageUpload}
      multiple={true}
    />
  );
};
```

## Customization

### 1. Custom Image Selector

```javascript
import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

const CustomImageSelector = ({
  afterUpload,
  activate,
  onCancel,
  multiple,
  title,
  uploadMessage,
  maxFileSize = 25 * 1024 * 1024,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  customStyles = {}
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFiles = useCallback(async (files) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Validate files
      const validFiles = Array.from(files).filter(file => {
        if (file.size > maxFileSize) {
          console.warn(`File ${file.name} exceeds size limit`);
          return false;
        }
        if (!acceptedFormats.includes(file.type)) {
          console.warn(`File ${file.name} has unsupported format`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        throw new Error('No valid files selected');
      }

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Process files
      const processedFiles = validFiles.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }));

      // Call afterUpload with processed files
      const result = await afterUpload({ files: processedFiles });
      
      setUploadProgress(100);
      clearInterval(interval);
      
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [afterUpload, maxFileSize, acceptedFormats]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback(async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  }, [handleFiles]);

  return (
    <Box
      sx={{
        border: dragActive ? '2px solid #1976d2' : '2px dashed #ccc',
        borderRadius: 2,
        padding: 4,
        textAlign: 'center',
        backgroundColor: dragActive ? '#f3f4f6' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...customStyles
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {uploadMessage}
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
        Max file size: {Math.round(maxFileSize / (1024 * 1024))}MB
      </Typography>

      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary">
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      <input
        type="file"
        multiple={multiple}
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-input"
        disabled={uploading}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          component="label"
          htmlFor="file-input"
          disabled={uploading}
          startIcon={<CloudUpload />}
        >
          Choose Files
        </Button>
        
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={uploading}
          startIcon={<Close />}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

// Usage
const GalleryWithCustomSelector = () => {
  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={true}
      ownerEntity={{ id: 'entity-123' }}
      imageHandlerApi={handleUpload}
      multiple={true}
      slot={{
        selector: CustomImageSelector
      }}
      slotProps={{
        selector: {
          maxFileSize: 10 * 1024 * 1024, // 10MB
          acceptedFormats: ['image/jpeg', 'image/png'],
          customStyles: {
            backgroundColor: '#f8f9fa',
            borderColor: '#007bff'
          }
        }
      }}
    />
  );
};
```

### 2. Custom Error Handling

```javascript
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const GalleryWithErrorHandling = ({ images, entityId }) => {
  const [error, setError] = useState(null);

  const handleShowError = (message) => {
    setError(message);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <GoalImageGallery
        imageCodes={images}
        canEdit={true}
        ownerEntity={{ id: entityId }}
        imageHandlerApi={handleUpload}
        showError={handleShowError}
        multiple={true}
      />
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
```

## Performance Optimization

### 1. Lazy Loading Implementation

```javascript
import React, { useMemo } from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

const OptimizedGallery = ({ images, entityId }) => {
  // Memoize expensive operations
  const memoizedImages = useMemo(() => {
    return images.slice(0, 50); // Limit initial load
  }, [images]);

  const optimizedGetImageUrl = useMemo(() => {
    return ({ imageCode, thumbMail }) => {
      const baseUrl = 'https://api.example.com';
      const size = thumbMail ? 'thumb' : 'full';
      return `${baseUrl}/images/${imageCode}?size=${size}&format=webp`;
    };
  }, []);

  return (
    <GoalImageGallery
      imageCodes={memoizedImages}
      canEdit={true}
      ownerEntity={{ id: entityId }}
      imageHandlerApi={handleUpload}
      getImageUrl={optimizedGetImageUrl}
      multiple={true}
      enableLazyLoading={true}
    />
  );
};
```

### 2. Virtual Scrolling for Large Galleries

```javascript
import React, { useState, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

const VirtualizedGallery = ({ images, entityId }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  const visibleImages = useMemo(() => {
    return images.slice(visibleRange.start, visibleRange.end);
  }, [images, visibleRange]);

  const handleScroll = useCallback((scrollTop) => {
    const itemHeight = 200;
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + 20;
    setVisibleRange({ start, end });
  }, []);

  return (
    <GoalImageGallery
      imageCodes={visibleImages}
      canEdit={true}
      ownerEntity={{ id: entityId }}
      imageHandlerApi={handleUpload}
      multiple={true}
      onScroll={handleScroll}
      enableVirtualization={true}
    />
  );
};
```

## Error Handling

### 1. Comprehensive Error Handling

```javascript
import React, { useState, useCallback } from 'react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

const RobustGallery = ({ images, entityId }) => {
  const [errors, setErrors] = useState([]);

  const handleImageUpload = useCallback(async (imageData) => {
    try {
      // Validate files
      const validationErrors = [];
      const validFiles = imageData.files.filter(file => {
        if (file.size > 25 * 1024 * 1024) {
          validationErrors.push(`File ${file.name} is too large (max 25MB)`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          validationErrors.push(`File ${file.name} is not a valid image`);
          return false;
        }
        return true;
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return {
          success: false,
          message: 'Some files could not be uploaded'
        };
      }

      // Attempt upload with retry logic
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const response = await uploadFiles(validFiles);
          return {
            success: true,
            data: response.data,
            message: 'Upload successful'
          };
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error;
          }
          
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempts) * 1000)
          );
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Categorize errors
      let userMessage = 'Upload failed. Please try again.';
      
      if (error.name === 'NetworkError') {
        userMessage = 'Network error. Please check your connection.';
      } else if (error.status === 413) {
        userMessage = 'File too large. Please select smaller files.';
      } else if (error.status === 403) {
        userMessage = 'You don\'t have permission to upload files.';
      } else if (error.status === 500) {
        userMessage = 'Server error. Please try again later.';
      }

      return {
        success: false,
        message: userMessage,
        error: error
      };
    }
  }, []);

  const handleShowError = useCallback((message) => {
    setErrors(prev => [...prev, message]);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <div>
      {errors.length > 0 && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {errors.map((error, index) => (
            <div key={index} style={{ color: '#c62828' }}>
              {error}
            </div>
          ))}
          <button onClick={clearErrors} style={{ marginTop: '5px' }}>
            Clear Errors
          </button>
        </div>
      )}
      
      <GoalImageGallery
        imageCodes={images}
        canEdit={true}
        ownerEntity={{ id: entityId }}
        imageHandlerApi={handleImageUpload}
        showError={handleShowError}
        multiple={true}
      />
    </div>
  );
};
```

## Testing

### 1. Unit Tests

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

describe('GoalImageGallery', () => {
  const mockImageHandlerApi = jest.fn();
  const mockAfterUpload = jest.fn();

  beforeEach(() => {
    mockImageHandlerApi.mockClear();
    mockAfterUpload.mockClear();
  });

  test('renders gallery with images', () => {
    render(
      <GoalImageGallery
        imageCodes={['img1', 'img2']}
        canEdit={false}
      />
    );

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    mockImageHandlerApi.mockResolvedValue({
      success: true,
      data: [{ code: 'new-img', url: 'http://example.com/new-img.jpg' }],
      message: 'Upload successful'
    });

    render(
      <GoalImageGallery
        imageCodes={[]}
        canEdit={true}
        ownerEntity={{ id: 'test-entity' }}
        imageHandlerApi={mockImageHandlerApi}
        afterUpload={mockAfterUpload}
        multiple={true}
      />
    );

    // Simulate file upload
    const fileInput = screen.getByLabelText(/select files/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockImageHandlerApi).toHaveBeenCalledWith(
        expect.objectContaining({
          files: [file]
        })
      );
    });

    expect(mockAfterUpload).toHaveBeenCalledWith({
      success: true,
      data: [{ code: 'new-img', url: 'http://example.com/new-img.jpg' }],
      message: 'Upload successful'
    });
  });

  test('handles upload error', async () => {
    mockImageHandlerApi.mockResolvedValue({
      success: false,
      message: 'Upload failed'
    });

    const mockShowError = jest.fn();

    render(
      <GoalImageGallery
        imageCodes={[]}
        canEdit={true}
        ownerEntity={{ id: 'test-entity' }}
        imageHandlerApi={mockImageHandlerApi}
        showError={mockShowError}
        multiple={true}
      />
    );

    // Simulate file upload
    const fileInput = screen.getByLabelText(/select files/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Upload failed');
    });
  });

  test('supports keyboard navigation', () => {
    render(
      <GoalImageGallery
        imageCodes={['img1', 'img2']}
        canEdit={false}
      />
    );

    const gallery = screen.getByRole('grid');
    
    // Test tab navigation
    fireEvent.keyDown(gallery, { key: 'Tab' });
    expect(document.activeElement).toBe(gallery.firstChild);
    
    // Test arrow navigation
    fireEvent.keyDown(gallery, { key: 'ArrowRight' });
    // Add assertions for navigation behavior
  });
});
```

### 2. Integration Tests

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/upload', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      images: [
        { code: 'img1', url: 'http://example.com/img1.jpg' }
      ]
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('full upload workflow', async () => {
  const handleImageUpload = async (imageData) => {
    const formData = new FormData();
    imageData.files.forEach(file => formData.append('files', file));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  };

  render(
    <GoalImageGallery
      imageCodes={[]}
      canEdit={true}
      ownerEntity={{ id: 'test-entity' }}
      imageHandlerApi={handleImageUpload}
      multiple={true}
    />
  );

  // Upload a file
  const fileInput = screen.getByLabelText(/select files/i);
  const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });

  fireEvent.change(fileInput, { target: { files: [file] } });

  // Wait for upload to complete
  await waitFor(() => {
    expect(screen.getByAltText(/img1/i)).toBeInTheDocument();
  });
});
```

## Deployment

### 1. Build Configuration

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'goal-image-gallery.js',
    library: 'GoalImageGallery',
    libraryTarget: 'umd'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@mui/material': 'mui-material',
    '@mui/icons-material': 'mui-icons-material',
    '@emotion/react': 'emotion-react',
    '@emotion/styled': 'emotion-styled'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "build": "npm run clean && npm run build:js && npm run build:types",
    "build:js": "babel src --out-dir lib --copy-files --ignore '**/*.test.js'",
    "build:types": "cp src/index.d.ts lib/index.d.ts",
    "build:watch": "npm run build:js -- --watch",
    "clean": "rm -rf lib dist",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx}",
    "validate": "npm run lint && npm run test && npm run build",
    "prepublishOnly": "npm run validate"
  }
}
```

### 3. CDN Deployment

```html
<!-- Include via CDN -->
<script src="https://unpkg.com/@mgonza02/goal-image-gallery@latest/dist/goal-image-gallery.js"></script>

<script>
  // Use the global GoalImageGallery
  const gallery = React.createElement(GoalImageGallery, {
    imageCodes: ['img1', 'img2'],
    canEdit: false
  });
  
  ReactDOM.render(gallery, document.getElementById('gallery-container'));
</script>
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Images Not Loading

**Problem**: Images show as broken or don't load at all.

**Solutions**:
```javascript
// Check image URLs
const debugGetImageUrl = ({ imageCode, thumbMail }) => {
  const url = `https://api.example.com/images/${imageCode}`;
  console.log('Generated URL:', url);
  return url;
};

// Add error handling
const handleImageError = (error) => {
  console.error('Image load error:', error);
  // Show fallback image or placeholder
};

// Use with gallery
<GoalImageGallery
  imageCodes={images}
  getImageUrl={debugGetImageUrl}
  onImageError={handleImageError}
  noImageUrl="/fallback-image.jpg"
/>
```

#### 2. Upload Not Working

**Problem**: File uploads fail or don't trigger.

**Solutions**:
```javascript
// Debug upload function
const debugUploadHandler = async (imageData) => {
  console.log('Upload data:', imageData);
  
  try {
    // Validate data
    if (!imageData.files || imageData.files.length === 0) {
      throw new Error('No files provided');
    }
    
    // Test API call
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: imageData.formData
    });
    
    console.log('Upload response:', response);
    
    const result = await response.json();
    console.log('Upload result:', result);
    
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};
```

#### 3. Permission Issues

**Problem**: Users can't edit even with proper permissions.

**Solutions**:
```javascript
// Debug permission system
const debugPermissions = (permission) => {
  console.log('Checking permission:', permission);
  console.log('User permissions:', user.permissions);
  
  const hasPermission = user.permissions.includes(permission);
  console.log('Has permission:', hasPermission);
  
  return hasPermission;
};

// Use with gallery
<GoalImageGallery
  imageCodes={images}
  canEdit={true}
  permission="EDIT_IMAGES"
  hasPermission={debugPermissions}
/>
```

#### 4. Performance Issues

**Problem**: Gallery is slow with many images.

**Solutions**:
```javascript
// Optimize image loading
const optimizedGallery = () => {
  const [visibleImages, setVisibleImages] = useState(images.slice(0, 20));
  
  const loadMoreImages = useCallback(() => {
    setVisibleImages(prev => [
      ...prev,
      ...images.slice(prev.length, prev.length + 20)
    ]);
  }, [images]);
  
  return (
    <GoalImageGallery
      imageCodes={visibleImages}
      onLoadMore={loadMoreImages}
      enableLazyLoading={true}
    />
  );
};
```

#### 5. Accessibility Issues

**Problem**: Gallery not accessible to screen readers.

**Solutions**:
```javascript
// Enhance accessibility
<GoalImageGallery
  imageCodes={images}
  aria-label="Product image gallery"
  aria-describedby="gallery-instructions"
  role="img"
  // Add descriptive alt text
  getImageAlt={(imageCode) => `Product image ${imageCode}`}
/>
```

### Debug Mode

Enable debug mode for development:

```javascript
const DebugGallery = ({ images }) => {
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === 'development');
  
  return (
    <div>
      <button onClick={() => setDebugMode(!debugMode)}>
        Toggle Debug Mode
      </button>
      
      <GoalImageGallery
        imageCodes={images}
        debug={debugMode}
        onDebug={(event, data) => {
          console.log('Debug event:', event, data);
        }}
      />
    </div>
  );
};
```

### Browser Compatibility

```javascript
// Check browser support
const checkBrowserSupport = () => {
  const support = {
    fileAPI: typeof FileReader !== 'undefined',
    dragDrop: 'draggable' in document.createElement('div'),
    clipboard: navigator.clipboard !== undefined,
    webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
  };
  
  console.log('Browser support:', support);
  return support;
};

// Use with gallery
const BrowserAwareGallery = ({ images }) => {
  const [browserSupport] = useState(checkBrowserSupport());
  
  return (
    <GoalImageGallery
      imageCodes={images}
      enableClipboard={browserSupport.clipboard}
      enableDragDrop={browserSupport.dragDrop}
      preferWebP={browserSupport.webp}
    />
  );
};
```

---

This implementation guide provides comprehensive coverage of the GoalImageGallery component, from basic usage to advanced customization and troubleshooting. For additional help or specific use cases, refer to the component's documentation or contact the development team.
