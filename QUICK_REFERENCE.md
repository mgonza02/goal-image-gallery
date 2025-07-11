# GoalImageGallery - Quick Reference

## Installation

```bash
npm install @mgonza02/goal-image-gallery
```

## Basic Usage

```javascript
import { GoalImageGallery } from '@mgonza02/goal-image-gallery';

// Read-only gallery
<GoalImageGallery imageCodes={['img1', 'img2']} canEdit={false} />

// Editable gallery
<GoalImageGallery
  imageCodes={images}
  canEdit={true}
  ownerEntity={{ id: 'entity-123' }}
  imageHandlerApi={handleUpload}
  afterUpload={refreshData}
  multiple={true}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageCodes` | `string \| array` | - | Image codes to display |
| `canEdit` | `boolean` | `false` | Enable editing |
| `ownerEntity` | `object` | - | Owner entity data |
| `imageHandlerApi` | `function` | - | Upload handler function |
| `afterUpload` | `function` | - | Success callback |
| `multiple` | `boolean` | `false` | Allow multiple images |
| `permission` | `string` | - | Required permission |
| `emptyMessage` | `string` | `'No hay imágenes para mostrar'` | Empty state message |
| `showImageInfo` | `boolean` | `false` | Show image info |
| `allowDownload` | `boolean` | `true` | Enable downloads |

## Upload Methods

### 1. File Upload
```javascript
// Users can:
// - Click "Add Image" button
// - Drag & drop files
// - Use file dialog
```

### 2. Clipboard Paste
```javascript
// Users can:
// - Copy image (Ctrl+C)
// - Paste in gallery (Ctrl+V)
// - Automatically processed
```

### 3. URL Loading
```javascript
// Users can:
// - Enter image URL
// - Load remote images
// - Validate URL format
```

## API Handler Example

```javascript
const handleImageUpload = async (imageData) => {
  try {
    const response = await api.uploadImage({
      ...imageData,
      companyId: currentCompany,
      entityId: ownerEntity.id
    });
    
    return {
      success: true,
      data: response.data,
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

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Navigate images |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `Escape` | Close viewer |
| `Ctrl+V` | Paste image |

## Common Patterns

### Product Gallery
```javascript
<GoalImageGallery
  imageCodes={product.images}
  canEdit={hasPermission('EDIT_PRODUCTS')}
  ownerEntity={{ id: product.id, type: 'product' }}
  imageHandlerApi={productApi.uploadImages}
  afterUpload={refreshProduct}
  multiple={true}
  showImageInfo={true}
  slot = {    selector: SelectorComponent  }
  slotProps = {
        // Props for the slot component
        // e.g. { customProp: 'value' },
  }
  afterUpload={refreshUser}
  multiple={false}
  emptyMessage="No avatar set"
/>
```

### Document Attachments
```javascript
<GoalImageGallery
  imageCodes={document.attachments}
  canEdit={canEditDocs}
  ownerEntity={{ id: document.id, type: 'document' }}
  imageHandlerApi={docApi.uploadAttachments}
  afterUpload={refreshDocument}
  multiple={true}
  permission="EDIT_DOCUMENTS"
  allowDownload={true}
/>
```

## Error Handling

```javascript
const handleUpload = async (imageData) => {
  try {
    // Validate file
    if (imageData.size > 5 * 1024 * 1024) {
      throw new Error('File too large');
    }
    
    // Upload
    const response = await api.upload(imageData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
```

## Customization

### Custom Empty Message
```javascript
<GoalImageGallery
  imageCodes={[]}
  emptyMessage="Start your gallery by adding images"
  canEdit={true}
  // ... other props
/>
```

### Permission-Based Editing
```javascript
<GoalImageGallery
  imageCodes={images}
  canEdit={hasPermission('EDIT_IMAGES')}
  permission="EDIT_IMAGES"
  // ... other props
/>
```

### Custom Upload Folder
```javascript
const handleUpload = async (imageData) => {
  return await api.uploadImage({
    ...imageData,
    folder: 'custom-folder',
    application: 'MY_APP'
  });
};
```

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ⚠️ IE11 (limited, no clipboard)
- ✅ Mobile browsers (optimized)

## Performance Tips

1. Use thumbnail versions for gallery
2. Implement pagination for large sets
3. Compress images before upload
4. Use lazy loading for images
5. Cleanup object URLs properly

## Troubleshooting

**Images not loading?**
- Check image URLs
- Verify permissions
- Check network connectivity

**Upload not working?**
- Verify API handler
- Check file size limits
- Validate file formats

**Clipboard paste not working?**
- Ensure HTTPS
- Check browser support
- Verify permissions

**Poor performance?**
- Reduce image sizes
- Use pagination
- Implement virtual scrolling
