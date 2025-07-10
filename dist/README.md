# GoalImageGallery Component Documentation

## Overview

The `GoalImageGallery` is a modern, feature-rich image gallery component for the Goal application. It provides a comprehensive solution for displaying, managing, and uploading images with advanced UI/UX features and accessibility support.

## Key Features

### 🖼️ **Multi-Method Image Upload**
- **File Upload**: Traditional file selection with drag-and-drop support
- **Clipboard Paste**: Paste images directly from clipboard using Ctrl+V
- **URL Loading**: Load images from remote URLs

### 🎨 **Modern UI/UX**
- Responsive grid layout that adapts to screen size
- Smooth hover effects and transitions
- Material Design 3 styling
- Dark/light theme support
- Loading states and skeleton animations

### 🔍 **Advanced Image Viewer**
- Full-screen modal viewer
- Zoom controls (0.5x to 3x)
- Image navigation (previous/next)
- Keyboard navigation support
- Download functionality

### ♿ **Accessibility**
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode compatibility
- Focus management

### 📱 **Mobile Responsive**
- Touch-friendly interface
- Optimized for mobile devices
- Swipe gestures support
- Responsive breakpoints

## Installation

```javascript
import GoalImageGallery from './components/common/goal-image-gallery';
```

## Basic Usage

### Simple Gallery
```javascript
<GoalImageGallery
  imageCodes={['img1', 'img2', 'img3']}
  canEdit={false}
/>
```

### Editable Gallery
```javascript
<GoalImageGallery
  imageCodes={imageCodes}
  canEdit={true}
  ownerEntity={{ id: 'product-123' }}
  imageHandlerApi={handleImageUpload}
  afterUpload={refreshImages}
  multiple={true}
/>
```

### Advanced Configuration
```javascript
<GoalImageGallery
  imageCodes={imageCodes}
  canEdit={true}
  ownerEntity={{ id: 'product-123', type: 'product' }}
  imageHandlerApi={handleImageUpload}
  afterUpload={refreshImages}
  multiple={true}
  permission="EDIT_IMAGES"
  emptyMessage="No product images available"
  showImageInfo={true}
  allowDownload={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `canEdit` | `boolean` | `false` | Enable editing capabilities |
| `ownerEntity` | `object` | - | Entity that owns the images |
| `imageHandlerApi` | `function` | - | API function for image operations |
| `afterUpload` | `function` | - | Callback after successful upload |
| `imageCodes` | `string \| array` | - | Image codes to display |
| `multiple` | `boolean` | `false` | Allow multiple image selection |
| `permission` | `string` | - | Required permission for editing |
| `emptyMessage` | `string` | `'No hay imágenes para mostrar'` | Message shown when no images |
| `showImageInfo` | `boolean` | `false` | Show image information overlay |
| `allowDownload` | `boolean` | `true` | Enable download functionality |

## Upload Methods

### 1. File Upload
Users can upload images by:
- Clicking the "Add Image" button
- Dragging and dropping files onto the gallery
- Using the file selection dialog

**Supported formats**: JPEG, PNG, GIF, WebP
**Maximum file size**: 25MB (configurable)

### 2. Clipboard Paste
Users can paste images directly from the clipboard:
- Copy an image from any source (screenshot, browser, etc.)
- Press `Ctrl+V` anywhere in the gallery
- The image will be automatically processed and uploaded

**Note**: Clipboard functionality requires modern browser support

### 3. URL Loading
Users can load images from URLs:
- Enter a direct image URL
- The component validates the URL and loads the image
- Supports all standard image formats

## Keyboard Shortcuts

### Image Viewer
- `←` / `→`: Navigate between images
- `+` / `=`: Zoom in
- `-`: Zoom out
- `Escape`: Close image viewer

### Gallery Navigation
- `Tab`: Navigate between interactive elements
- `Enter` / `Space`: Activate buttons
- `Escape`: Close dialogs

## API Integration

The component requires an `imageHandlerApi` function that handles image operations:

```javascript
const handleImageUpload = async (imageData) => {
  try {
    const response = await api.uploadImages({
      ...imageData,
      companyId: currentCompany,
      entityId: ownerEntity.id
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
```

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
import { GoalImageGallery } from '@goal/components/common/goal-image-gallery';
```

#### Sub-components
```javascript
import { 
  ImageGalleryGrid, 
  ImageGalleryModal, 
  ImageGalleryItem,
  ImageGalleryEmptyState
} from '@goal/components/common/goal-image-gallery';
```

#### Custom Hooks
```javascript
import { 
  useImageGallery,
  useImageZoom,
  useClipboard,
  useKeyboardNavigation
} from '@goal/components/common/goal-image-gallery';
```

#### Styled Components
```javascript
import { 
  StyledImageContainer,
  ImageOverlay,
  StyledModalContainer
} from '@goal/components/common/goal-image-gallery';
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
} from '@goal/components/common/goal-image-gallery';
```

### Using Individual Components

```javascript
import { 
  ImageGalleryGrid, 
  ImageGalleryModal, 
  useImageGallery 
} from '@goal/components/common/goal-image-gallery';

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
  "name": "@goal/image-gallery",
  "version": "1.0.0",
  "description": "Enhanced, modular image gallery component for React applications",
  "main": "index.js",
  "module": "index.js",
  "types": "index.d.ts"
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
