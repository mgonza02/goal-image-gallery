# GoalImageGallery Component Documentation

## Overview

The `GoalImageGallery` is a modern, feature-rich image gallery component for React applications. It provides a comprehensive solution for displaying, managing, and uploading images with advanced UI/UX features, accessibility support, and extensive customization options. This component is designed to be highly modular, performant, and easy to integrate into any React application.

## 🚀 Quick Start

```bash
npm install @mgonza02/goal-image-gallery
```

```javascript
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

// Basic usage
<GoalImageGallery imageCodes={['img1', 'img2']} canEdit={false} />
```

## Key Features

### 🖼️ **Multi-Method Image Upload**
- **File Upload**: Traditional file selection with drag-and-drop support
- **Clipboard Paste**: Paste images directly from clipboard using Ctrl+V
- **URL Loading**: Load images from remote URLs
- **Batch Upload**: Upload multiple images simultaneously

### 🎨 **Modern UI/UX**
- **Responsive Design**: Adapts to all screen sizes and devices
- **Material Design 3**: Latest Material-UI components and styling
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Dark/Light Theme**: Automatic theme detection and support
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation

### 🔍 **Advanced Image Viewer**
- **Full-Screen Modal**: Immersive image viewing experience
- **Zoom Controls**: Zoom from 0.5x to 3x with smooth transitions
- **Image Navigation**: Previous/next with keyboard shortcuts
- **Download Support**: Direct image download functionality
- **Image Information**: Display metadata and details

### 🛠️ **Customization & Extensibility**
- **Slot System**: Replace default components with custom implementations
- **Flexible Props**: Extensive configuration options
- **TypeScript Support**: Full type definitions included
- **Hook-Based Architecture**: Reusable custom hooks for complex logic

### 📱 **Mobile-First Design**
- **Touch Gestures**: Swipe, pinch-to-zoom, and tap interactions
- **Responsive Breakpoints**: Optimized layouts for all devices
- **Performance Optimized**: Lazy loading and efficient rendering
- **Offline Support**: Graceful degradation for poor connectivity

## Installation & Setup

### NPM Installation

```bash
npm install @mgonza02/goal-image-gallery
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom
```

### Import

```javascript
// Main component
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

// Individual components and hooks
import { 
  ImageGalleryGrid, 
  ImageGalleryModal, 
  useImageGallery,
  useImageZoom 
} from '@mgonza02/goal-image-gallery';
```

### TypeScript Support

The component includes full TypeScript definitions:

```typescript
import { GoalImageGalleryProps } from '@mgonza02/goal-image-gallery';

const MyComponent: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <GoalImageGallery
      imageCodes={images}
      canEdit={true}
      // TypeScript will provide full autocomplete and type checking
    />
  );
};
```

## Usage Examples

### 1. Basic Read-Only Gallery

Perfect for displaying images without editing capabilities:

```javascript
<GoalImageGallery
  imageCodes={['img1', 'img2', 'img3']}
  canEdit={false}
  emptyMessage="No images to display"
  getImageUrl={({ imageCode }) => `https://api.example.com/images/${imageCode}`}
/>
```

### 2. Editable Product Gallery

Full-featured gallery with upload, edit, and delete capabilities:

```javascript
const ProductGallery = () => {
  const [productImages, setProductImages] = useState(['prod1', 'prod2']);
  
  const handleImageUpload = async (imageData) => {
    try {
      const response = await api.uploadProductImage({
        ...imageData,
        productId: product.id,
        companyId: currentCompany
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Images uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };

  const refreshProduct = (result) => {
    // Update product data
    setProductImages(prev => [...prev, result.data.code]);
  };

  return (
    <GoalImageGallery
      imageCodes={productImages}
      canEdit={true}
      ownerEntity={{ id: product.id, type: 'product' }}
      imageHandlerApi={handleImageUpload}
      afterUpload={refreshProduct}
      multiple={true}
      emptyMessage="No product images available"
      showImageInfo={true}
      allowDownload={true}
      permission="EDIT_PRODUCTS"
      hasPermission={(perm) => userPermissions.includes(perm)}
      currentCompany={user.companyId}
    />
  );
};
```

### 3. User Avatar Gallery

Single image gallery for user avatars:

```javascript
<GoalImageGallery
  imageCodes={user.avatar}
  canEdit={isOwner}
  ownerEntity={{ id: user.id, type: 'user' }}
  imageHandlerApi={userImageApi.upload}
  afterUpload={refreshUser}
  multiple={false}
  emptyMessage="No avatar set"
  showImageInfo={false}
  getImageUrl={({ imageCode }) => `https://cdn.example.com/avatars/${imageCode}`}
/>
```

### 4. Custom Image Selector

Using the slot system to provide a custom image selector:

```javascript
// Custom selector component
const CustomImageSelector = ({ 
  afterUpload, 
  activate, 
  onCancel, 
  multiple, 
  title, 
  uploadMessage,
  maxFileSize,
  acceptedFormats,
  customStyles 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    setUploading(true);
    try {
      // Custom upload logic
      const result = await uploadFiles(files);
      afterUpload(result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      style={{
        ...customStyles,
        border: dragActive ? '2px solid #007bff' : '2px dashed #ccc',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: dragActive ? '#f8f9fa' : '#fff'
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        await handleFiles(files);
      }}
    >
      <h3>{title}</h3>
      <p>{uploadMessage}</p>
      {uploading && <p>Uploading...</p>}
      <input 
        type="file" 
        multiple={multiple}
        accept={acceptedFormats?.join(',')}
        onChange={(e) => handleFiles(Array.from(e.target.files))}
        style={{ margin: '10px 0' }}
      />
      <br />
      <button onClick={onCancel} disabled={uploading}>
        Cancel
      </button>
    </div>
  );
};

// Usage with custom selector
<GoalImageGallery
  imageCodes={images}
  canEdit={true}
  ownerEntity={{ id: 'entity-123' }}
  imageHandlerApi={handleUpload}
  afterUpload={refreshData}
  multiple={true}
  slot={{
    selector: CustomImageSelector
  }}
  slotProps={{
    selector: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      customStyles: { 
        borderColor: '#007bff',
        backgroundColor: '#f8f9fa'
      }
    }
  }}
/>
```
  ownerEntity={{ id: 'product-123', type: 'product' }}
  imageHandlerApi={handleImageUpload}
  afterUpload={refreshImages}
  multiple={true}
  slot={{
    selector: CustomImageSelector
  }}
  slotProps={{
    selector: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      acceptedFormats: ['image/jpeg', 'image/png'],
      uploadEndpoint: '/api/upload',
      customStyles: { borderColor: '#007bff' }
    }
  }}
/>
```

## Props Reference

### Core Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `imageCodes` | `string \| string[]` | `[]` | No | Image codes to display in the gallery |
| `canEdit` | `boolean` | `false` | No | Enable editing capabilities (upload, delete) |
| `ownerEntity` | `object` | `undefined` | No | Entity that owns the images (required for editing) |
| `imageHandlerApi` | `function` | `undefined` | No | API function for image operations (required for editing) |
| `afterUpload` | `function` | `undefined` | No | Callback function called after successful upload |
| `multiple` | `boolean` | `false` | No | Allow multiple image selection and upload |

### Display Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `emptyMessage` | `string` | `'No hay imágenes para mostrar'` | No | Message displayed when no images are available |
| `showImageInfo` | `boolean` | `false` | No | Show image information overlay on hover |
| `allowDownload` | `boolean` | `false` | No | Enable image download functionality |
| `getImageUrl` | `function` | `({ imageCode }) => '/images/${imageCode}'` | No | Function to generate image URLs from codes |
| `noImageUrl` | `string` | `'/images/no-image.png'` | No | Fallback image URL for broken images |

### Permission Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `permission` | `string` | `undefined` | No | Required permission string for editing |
| `hasPermission` | `function` | `() => true` | No | Function to check if user has required permission |
| `currentCompany` | `string` | `'default'` | No | Current company identifier for API calls |

### Customization Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `slot` | `object` | `{}` | No | Slot components for customization |
| `slotProps` | `object` | `{}` | No | Props passed to slot components |
| `showError` | `function` | `console.error` | No | Function to display error messages |

### Advanced Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `maxFileSize` | `number` | `25 * 1024 * 1024` | No | Maximum file size in bytes (25MB default) |
| `acceptedFormats` | `string[]` | `['image/jpeg', 'image/png', 'image/gif', 'image/webp']` | No | Accepted image formats |
| `thumbnailSize` | `number` | `200` | No | Thumbnail size in pixels |
| `gridColumns` | `number` | `auto` | No | Number of columns in grid (auto-calculated if not provided) |
| `enableLazyLoading` | `boolean` | `true` | No | Enable lazy loading for images |
| `enableVirtualization` | `boolean` | `false` | No | Enable virtual scrolling for large image sets |

### Prop Examples

```javascript
// Basic configuration
<GoalImageGallery
  imageCodes={['img1', 'img2', 'img3']}
  canEdit={false}
/>

// Full configuration
<GoalImageGallery
  imageCodes={product.images}
  canEdit={user.canEdit}
  ownerEntity={{ id: product.id, type: 'product' }}
  imageHandlerApi={async (data) => {
    const response = await api.uploadImage(data);
    return { success: true, data: response };
  }}
  afterUpload={(result) => {
    console.log('Upload successful:', result);
    refreshProduct();
  }}
  multiple={true}
  permission="EDIT_PRODUCTS"
  emptyMessage="No product images yet"
  showImageInfo={true}
  allowDownload={true}
  getImageUrl={({ imageCode, thumbMail }) => 
    `https://api.example.com/images/${imageCode}${thumbMail ? '?thumb=true' : ''}`
  }
  noImageUrl="https://api.example.com/images/placeholder.png"
  hasPermission={(perm) => user.permissions.includes(perm)}
  currentCompany={user.companyId}
  showError={(msg) => toast.error(msg)}
  maxFileSize={10 * 1024 * 1024}
  acceptedFormats={['image/jpeg', 'image/png']}
  thumbnailSize={150}
  gridColumns={3}
/>
```

## Upload Methods & Features

### 1. File Upload (Drag & Drop)

The most common method for uploading images:

```javascript
// Features:
// - Click to select files
// - Drag and drop support
// - Multiple file selection
// - File type validation
// - Size limit enforcement
// - Progress indication

<GoalImageGallery
  canEdit={true}
  multiple={true}
  maxFileSize={10 * 1024 * 1024} // 10MB
  acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
  // ... other props
/>
```

**Supported Features:**
- **File Types**: JPEG, PNG, GIF, WebP, SVG
- **Size Limits**: Configurable (default: 25MB)
- **Batch Upload**: Upload multiple files simultaneously
- **Progress Tracking**: Visual progress indicators
- **Error Handling**: File validation and error reporting

### 2. Clipboard Paste

Revolutionary clipboard image support:

```javascript
// Usage:
// 1. Copy image from any source (screenshot, browser, etc.)
// 2. Focus on the gallery
// 3. Press Ctrl+V (Cmd+V on Mac)
// 4. Image is automatically processed and uploaded

// Auto-enabled when canEdit={true}
<GoalImageGallery
  canEdit={true}
  // Clipboard paste is automatically available
/>
```

**Clipboard Features:**
- **Cross-Platform**: Works on Windows, Mac, and Linux
- **Source Agnostic**: Copy from any application
- **Auto-Processing**: Automatic image processing and optimization
- **Format Support**: All major image formats
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

### 3. URL Loading

Load images from external URLs:

```javascript
// Users can enter image URLs directly
// Component validates and loads the image
// Supports CORS-enabled images

const handleUrlUpload = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Process the image
    const result = await processImageBlob(blob);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to load image from URL'
    };
  }
};
```

### 4. Mobile Camera Integration

Enhanced mobile support:

```javascript
// Mobile-specific features:
// - Camera access
// - Photo library access
// - Touch gestures
// - Responsive design

<GoalImageGallery
  canEdit={true}
  // Mobile camera is automatically available on mobile devices
  mobileOptimized={true}
  touchGestures={true}
/>
```

## Keyboard Shortcuts & Navigation

### Image Viewer Shortcuts

| Shortcut | Action | Context |
|----------|---------|---------|
| `←` / `→` | Navigate between images | Image viewer open |
| `+` / `=` | Zoom in | Image viewer open |
| `-` | Zoom out | Image viewer open |
| `Escape` | Close image viewer | Image viewer open |
| `Space` | Toggle fullscreen | Image viewer open |
| `Enter` | Open selected image | Gallery focused |

### Gallery Navigation

| Shortcut | Action | Context |
|----------|---------|---------|
| `Tab` | Navigate between elements | Gallery focused |
| `Shift + Tab` | Navigate backwards | Gallery focused |
| `Enter` / `Space` | Activate button/link | Element focused |
| `Ctrl + V` | Paste from clipboard | Editing enabled |
| `Delete` | Remove selected image | Image selected |

### Accessibility Features

```javascript
// Built-in accessibility features:
<GoalImageGallery
  // ARIA labels are automatically generated
  ariaLabel="Product image gallery"
  ariaDescribedBy="gallery-instructions"
  
  // Screen reader support
  screenReaderOptimized={true}
  
  // High contrast mode
  highContrastMode={true}
  
  // Keyboard navigation
  keyboardNavigation={true}
  
  // Focus management
  manageFocus={true}
/>
```

### Custom Keyboard Shortcuts

```javascript
import { useKeyboardNavigation } from '@mgonza02/goal-image-gallery';

const CustomGallery = () => {
  const { handleKeyPress } = useKeyboardNavigation({
    onPreviousImage: () => console.log('Previous'),
    onNextImage: () => console.log('Next'),
    onCloseImage: () => console.log('Close'),
    onZoomIn: () => console.log('Zoom in'),
    onZoomOut: () => console.log('Zoom out'),
    // Add custom shortcuts
    customShortcuts: {
      'd': () => downloadCurrentImage(),
      'i': () => showImageInfo(),
      'f': () => toggleFullscreen()
    }
  });

  return (
    <div onKeyDown={handleKeyPress}>
      <GoalImageGallery {...props} />
    </div>
  );
};
```

## API Integration & Data Flow

### API Handler Function

The `imageHandlerApi` function is the core of the upload system:

```javascript
const handleImageUpload = async (imageData) => {
  try {
    // imageData contains:
    // - files: Array of File objects
    // - metadata: Additional data (owner, company, etc.)
    // - options: Upload options (compression, format, etc.)
    
    const response = await api.uploadImages({
      files: imageData.files,
      companyId: imageData.metadata.companyId,
      entityId: imageData.metadata.entityId,
      entityType: imageData.metadata.entityType,
      folder: imageData.options.folder,
      compression: imageData.options.compression,
      thumbnailSize: imageData.options.thumbnailSize
    });
    
    // Must return standardized response
    return {
      success: true,
      data: response.data, // Array of uploaded image objects
      message: 'Images uploaded successfully',
      codes: response.data.map(img => img.code) // Optional: image codes
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Upload failed',
      error: error
    };
  }
};
```

### API Response Format

Expected response format from your API:

```javascript
// Successful response
{
  success: true,
  data: [
    {
      id: 123,
      code: 'img_abc123',
      url: 'https://cdn.example.com/images/img_abc123.jpg',
      thumbnailUrl: 'https://cdn.example.com/images/img_abc123_thumb.jpg',
      filename: 'product-image.jpg',
      size: 1024000,
      width: 1920,
      height: 1080,
      mimeType: 'image/jpeg',
      uploadedAt: '2023-01-01T00:00:00Z'
    }
  ],
  message: 'Upload successful'
}

// Error response
{
  success: false,
  message: 'File size too large',
  error: {
    code: 'FILE_TOO_LARGE',
    details: 'Maximum file size is 25MB'
  }
}
```

### Real-World API Integration Examples

#### 1. REST API Integration

```javascript
const restApiHandler = async (imageData) => {
  const formData = new FormData();
  
  // Add files
  imageData.files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });
  
  // Add metadata
  formData.append('companyId', imageData.metadata.companyId);
  formData.append('entityId', imageData.metadata.entityId);
  formData.append('entityType', imageData.metadata.entityType);
  
  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        // Don't set Content-Type, let browser set it with boundary
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Upload failed');
    }
    
    return {
      success: true,
      data: result.images,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
```

#### 2. GraphQL Integration

```javascript
import { useMutation } from '@apollo/client';

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
      }
    }
  }
`;

const GraphQLImageGallery = ({ ownerEntity, ...props }) => {
  const [uploadImages] = useMutation(UPLOAD_IMAGES);
  
  const handleImageUpload = async (imageData) => {
    try {
      const { data } = await uploadImages({
        variables: {
          files: imageData.files,
          input: {
            companyId: imageData.metadata.companyId,
            entityId: imageData.metadata.entityId,
            entityType: imageData.metadata.entityType
          }
        }
      });
      
      return {
        success: data.uploadImages.success,
        data: data.uploadImages.images,
        message: data.uploadImages.message
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
      {...props}
      ownerEntity={ownerEntity}
      imageHandlerApi={handleImageUpload}
    />
  );
};
```

#### 3. Firebase Storage Integration

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

const firebaseHandler = async (imageData) => {
  try {
    const uploadPromises = imageData.files.map(async (file) => {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        id: snapshot.ref.fullPath,
        code: snapshot.ref.name,
        url: downloadURL,
        filename: file.name,
        size: file.size,
        mimeType: file.type
      };
    });
    
    const results = await Promise.all(uploadPromises);
    
    return {
      success: true,
      data: results,
      message: 'Images uploaded to Firebase'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
```

### Error Handling Best Practices

```javascript
const robustApiHandler = async (imageData) => {
  try {
    // Validate files before upload
    const validFiles = imageData.files.filter(file => {
      if (file.size > 25 * 1024 * 1024) {
        console.warn(`File ${file.name} is too large`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        console.warn(`File ${file.name} is not an image`);
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
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
  } catch (error) {
    // Log error for debugging
    console.error('Image upload failed:', error);
    
    return {
      success: false,
      message: error.message || 'Upload failed. Please try again.',
      error: error
    };
  }
};
```
    };
  }
};
```

## Customization Options

### Slot System

The GoalImageGallery supports a flexible slot system for customization:

#### Custom Image Selector

You can provide your own image selector component:

```javascript
// Custom selector component
const CustomImageSelector = ({ 
  afterUpload, 
  activate, 
  onCancel, 
  multiple, 
  title, 
  uploadMessage,
  maxFileSize,
  acceptedFormats,
  customStyles 
}) => {
  const handleFileSelect = async (files) => {
    // Your custom upload logic
    const result = await uploadFiles(files);
    afterUpload(result);
  };

  return (
    <div style={{ ...customStyles, padding: '20px' }}>
      <h3>{title}</h3>
      <p>{uploadMessage}</p>
      <input 
        type="file" 
        multiple={multiple}
        accept={acceptedFormats.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

// Usage
<GoalImageGallery
  // ... other props
  slot={{
    selector: CustomImageSelector
  }}
  slotProps={{
    selector: {
      maxFileSize: 10 * 1024 * 1024,
      acceptedFormats: ['image/jpeg', 'image/png'],
      customStyles: { 
        border: '2px dashed #007bff',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }
    }
  }}
/>
```

### Available Slots

| Slot | Description | Props Passed |
|------|-------------|--------------|
| `selector` | Custom image selector/uploader component | `afterUpload`, `activate`, `onCancel`, `multiple`, `title`, `uploadMessage`, and custom props from `slotProps.selector` |

## Styling and Theming

The component uses Material-UI's theming system and can be customized:

```javascript
const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          // Custom card styles
        }
      }
    }
  }
});
```

## Performance Considerations

- **Image Optimization**: Uses thumbnail versions for gallery view
- **Lazy Loading**: Images are loaded on demand
- **Memory Management**: Proper cleanup of object URLs
- **Debounced Operations**: Prevents excessive API calls

## Error Handling

The component provides comprehensive error handling:

- **Upload Errors**: File size, format, or network issues
- **Loading Errors**: Broken image URLs or network problems
- **Permission Errors**: Insufficient user permissions
- **Browser Compatibility**: Graceful degradation for older browsers

## Browser Support

- **Modern Browsers**: Full feature support
- **Internet Explorer 11**: Limited support (no clipboard paste)
- **Mobile Browsers**: Optimized experience
- **Accessibility Tools**: Full compatibility

## Examples

### Product Gallery
```javascript
<GoalImageGallery
  imageCodes={product.images}
  canEdit={hasPermission('EDIT_PRODUCTS')}
  ownerEntity={{ id: product.id, type: 'product' }}
  imageHandlerApi={productImageApi.upload}
  afterUpload={refreshProduct}
  multiple={true}
  emptyMessage="No product images available"
  showImageInfo={true}
/>
```

### User Avatar
```javascript
<GoalImageGallery
  imageCodes={user.avatar}
  canEdit={isOwner}
  ownerEntity={{ id: user.id, type: 'user' }}
  imageHandlerApi={userImageApi.upload}
  afterUpload={refreshUser}
  multiple={false}
  emptyMessage="No avatar set"
  showImageInfo={false}
/>
```

### Document Gallery
```javascript
<GoalImageGallery
  imageCodes={document.attachments}
  canEdit={canEditDocument}
  ownerEntity={{ id: document.id, type: 'document' }}
  imageHandlerApi={documentImageApi.upload}
  afterUpload={refreshDocument}
  multiple={true}
  permission="EDIT_DOCUMENTS"
  allowDownload={true}
/>
```

## Best Practices

1. **Performance**: Use thumbnail versions for gallery display
2. **Accessibility**: Always provide meaningful alt text
3. **Error Handling**: Implement comprehensive error handling
4. **Permissions**: Check user permissions before enabling editing
5. **Validation**: Validate file types and sizes on both client and server
6. **Responsive Design**: Test on various screen sizes
7. **Loading States**: Provide visual feedback during operations

## Troubleshooting

### Common Issues

**Issue**: Images not loading
- **Solution**: Check image URLs and permissions

**Issue**: Upload not working
- **Solution**: Verify `imageHandlerApi` is properly configured

**Issue**: Clipboard paste not working
- **Solution**: Ensure HTTPS and modern browser support

**Issue**: Poor performance with many images
- **Solution**: Implement pagination or virtual scrolling

### Debug Mode

Enable debug mode for development:

```javascript
<GoalImageGallery
  // ... other props
  debug={process.env.NODE_ENV === 'development'}
/>
```

## Migration Guide

### From CommonImageGallery

```javascript
// Old
<CommonImageGallery
  photos={photos}
  canEdit={canEdit}
  onSelectImage={handleSelect}
/>

// New
<GoalImageGallery
  imageCodes={imageCodes}
  canEdit={canEdit}
  ownerEntity={ownerEntity}
  imageHandlerApi={imageApi}
  afterUpload={handleUpload}
/>
```

### From Basic Image Display

```javascript
// Old
{images.map(img => (
  <img key={img.id} src={img.url} alt={img.title} />
))}

// New
<GoalImageGallery
  imageCodes={images.map(img => img.code)}
  canEdit={false}
/>
```

## Contributing

When contributing to this component:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test accessibility features
5. Verify mobile responsiveness
6. Update [CHANGELOG.md](CHANGELOG.md) with your changes

## Version History & Changelog

For detailed information about changes, new features, and updates across versions, see [CHANGELOG.md](CHANGELOG.md).

### Recent Updates
- **v1.0.6**: Major package cleanup and optimization
- **v1.0.5**: Initial package review and dependency analysis
- **v1.0.4**: Comprehensive documentation overhaul
- **v1.0.3**: NPM publication and scoped package setup
- **v1.0.2**: Slot system implementation and UI enhancements
- **v1.0.1**: Bug fixes and stability improvements
- **v1.0.0**: Initial release with core features

## License

This component is part of the Goal application and follows the project's licensing terms.

## 🏗️ **Modular Architecture**

The component has been fully modularized for better maintainability and reusability:

### Component Structure

```
goal-image-gallery/
├── index.js                 # Main exports
├── GoalImageGallery.js      # Main component
├── components/              # Modular sub-components
│   ├── ImageGalleryGrid.js
│   ├── ImageGalleryModal.js
│   ├── ImageGalleryItem.js
│   └── ImageGalleryEmptyState.js
├── hooks/                   # Custom hooks
│   └── use-image-gallery.js
├── styles/                  # Styled components
│   └── styled-components.js
├── utils/                   # Utility functions
│   └── image-utils.js
└── docs/                    # Documentation
    ├── README.md
    ├── QUICK_REFERENCE.md
    ├── MIGRATION.md
    └── examples.js
```

### Available Exports

#### Main Component
```javascript
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';
```

#### Sub-components
```javascript
import { 
  ImageGalleryGrid, 
  ImageGalleryModal, 
  ImageGalleryItem,
  ImageGalleryEmptyState
} from '@mgonza02/goal-image-gallery';
```

#### Custom Hooks
```javascript
import { 
  useImageGallery,
  useImageZoom,
  useClipboard,
  useKeyboardNavigation
} from '@mgonza02/goal-image-gallery';
```

#### Styled Components
```javascript
import { 
  StyledImageContainer,
  ImageOverlay,
  StyledModalContainer
} from '@mgonza02/goal-image-gallery';
```

#### Utility Functions
```javascript
import { 
  handleImageError,
  downloadImage,
  processImageCodes,
  getGridColumns,
  isValidImageFile,
  formatFileSize
} from '@mgonza02/goal-image-gallery';
```

### Using Individual Components

```javascript
import { 
  ImageGalleryGrid, 
  ImageGalleryModal, 
  useImageGallery 
} from '@mgonza02/goal-image-gallery';

function CustomGallery() {
  const { imageList, openImage, handleOpenImage } = useImageGallery({
    imageCodes: ['image1', 'image2'],
    multiple: true
  });

  return (
    <>
      <ImageGalleryGrid
        imageList={imageList}
        onImageClick={handleOpenImage}
        emptyMessage="No images"
      />
      <ImageGalleryModal
        open={openImage !== null}
        imageUrl={openImage}
        imageList={imageList}
        onClose={() => handleOpenImage(null)}
      />
    </>
  );
}
```

## 📦 **Independent Package**

The component is now ready for export as an independent package:

```json
{
  "name": "@mgonza02/goal-image-gallery",
  "version": "1.0.0",
  "description": "Enhanced, modular image gallery component for React applications",
  "main": "lib/index.js",
  "module": "lib/index.js",
  "types": "lib/index.d.ts"
}
```

### TypeScript Support

Full TypeScript definitions are included:

```typescript
interface GoalImageGalleryProps {
  canEdit?: boolean;
  ownerEntity?: object;
  imageHandlerApi?: (data: any) => Promise<any>;
  afterUpload?: (result: any) => void;
  imageCodes?: string | string[];
  multiple?: boolean;
  permission?: string;
  emptyMessage?: string;
  showImageInfo?: boolean;
  allowDownload?: boolean;
}
```
