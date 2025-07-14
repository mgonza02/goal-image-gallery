# handleAfterUpload Array Support Enhancement

## Overview
Enhanced the `handleAfterUpload` method in the `useImageGallery` hook to support both single image objects and arrays of image objects, enabling bulk image upload functionality.

## Changes Made

### 1. Modified `handleAfterUpload` Method
**File**: `src/hooks/use-image-gallery.js`

**Before**:
```javascript
const handleAfterUpload = useCallback(
  async (image) => {
    // Only handled single image objects
    const imagesToSave = imageList.reduce((acc, img) => {
      if (img.image_code !== '+') {
        acc.push(img.image_code === currentImageCode ? image.code : img.image_code);
      }
      return acc;
    }, []);
    // ...
  },
  [...]
);
```

**After**:
```javascript
const handleAfterUpload = useCallback(
  async (uploadedImages) => {
    // Handle both single image and array of images
    const imagesArray = Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages];
    
    const imagesToSave = imageList.reduce((acc, img) => {
      if (img.image_code !== '+') {
        // If this is the image being replaced, replace with the first uploaded image
        if (img.image_code === currentImageCode && imagesArray.length > 0) {
          acc.push(imagesArray[0].code);
        } else {
          acc.push(img.image_code);
        }
      }
      return acc;
    }, []);

    // If no current image code (adding new images), add all new image codes
    if (!currentImageCode) {
      imagesArray.forEach(image => {
        if (!imagesToSave.includes(image.code)) {
          imagesToSave.push(image.code);
        }
      });
    } else if (imagesArray.length > 1) {
      // If replacing and multiple images uploaded, add additional images
      imagesArray.slice(1).forEach(image => {
        if (!imagesToSave.includes(image.code)) {
          imagesToSave.push(image.code);
        }
      });
    }
    // ...
  },
  [...]
);
```

### 2. Updated TypeScript Definitions
**File**: `src/index.d.ts`

**Added new interface**:
```typescript
export interface UploadedImage {
  code: string;
  url?: string;
  filename?: string;
  size?: number;
  mimeType?: string;
}
```

**Updated method signature**:
```typescript
export interface UseImageGalleryReturn {
  // ... other properties
  handleAfterUpload: (images: UploadedImage | UploadedImage[]) => Promise<void>;
}
```

### 3. Added JSDoc Documentation
```javascript
/**
 * Handles the upload completion for single or multiple images
 * @param {Object|Object[]} uploadedImages - Single image object or array of image objects
 * @param {string} uploadedImages.code - The image code returned from the upload
 * @param {string} [uploadedImages.url] - Optional image URL
 * @param {string} [uploadedImages.filename] - Optional filename
 */
```

## Usage Examples

### Single Image Upload (Backward Compatible)
```javascript
const handleImageUpload = async (imageData) => {
  const response = await api.uploadImage(imageData);
  
  // Single image object
  const uploadedImage = {
    code: response.imageCode,
    url: response.imageUrl,
    filename: response.filename
  };
  
  // This still works as before
  handleAfterUpload(uploadedImage);
};
```

### Multiple Images Upload (New Feature)
```javascript
const handleBulkImageUpload = async (imageFiles) => {
  const response = await api.uploadImages(imageFiles);
  
  // Array of image objects
  const uploadedImages = response.images.map(img => ({
    code: img.imageCode,
    url: img.imageUrl,
    filename: img.filename,
    size: img.size,
    mimeType: img.mimeType
  }));
  
  // New functionality - handle array of images
  handleAfterUpload(uploadedImages);
};
```

### Real-World Example with Custom Image Selector
```javascript
const CustomBulkImageSelector = ({ afterUpload, multiple }) => {
  const handleFileSelect = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      return {
        code: result.imageCode,
        url: result.imageUrl,
        filename: file.name,
        size: file.size,
        mimeType: file.type
      };
    });
    
    try {
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Handle multiple images at once
      afterUpload(uploadedImages);
    } catch (error) {
      console.error('Bulk upload failed:', error);
    }
  };
  
  return (
    <input
      type="file"
      multiple={multiple}
      onChange={(e) => handleFileSelect(e.target.files)}
    />
  );
};
```

## Behavior Details

### Image Replacement Logic
1. **Single Image Mode**: 
   - If replacing an existing image, the first image in the array replaces the selected image
   - Additional images are added to the gallery

2. **Multiple Image Mode**:
   - If no image is selected (adding new), all images are added to the gallery
   - If replacing an existing image, the first image replaces the selected one, others are added

### Duplicate Prevention
- The method checks for duplicate image codes before adding them
- Uses `imagesToSave.includes(image.code)` to prevent duplicates

### Array Handling
- **Single Image**: Converted to array internally for consistent processing
- **Array of Images**: Processed directly
- **Empty Array**: Handled gracefully (no changes made)

## Benefits

### 1. **Backward Compatibility**
- Existing code using single image objects continues to work unchanged
- No breaking changes to the API

### 2. **Enhanced Functionality**
- Bulk upload support for multiple images
- Efficient processing of multiple uploads
- Reduced API calls for bulk operations

### 3. **Flexible Usage**
- Works with both single and multiple image uploads
- Supports various upload scenarios (replace, add, bulk)
- Maintains gallery state consistency

### 4. **Type Safety**
- Full TypeScript support with proper interfaces
- Clear type definitions for both single and array usage
- Enhanced development experience with autocomplete

## Testing Recommendations

### Unit Tests
```javascript
describe('handleAfterUpload', () => {
  test('handles single image upload', async () => {
    const singleImage = { code: 'img1', url: 'http://example.com/img1.jpg' };
    await handleAfterUpload(singleImage);
    // Assert single image is processed correctly
  });
  
  test('handles multiple images upload', async () => {
    const multipleImages = [
      { code: 'img1', url: 'http://example.com/img1.jpg' },
      { code: 'img2', url: 'http://example.com/img2.jpg' }
    ];
    await handleAfterUpload(multipleImages);
    // Assert multiple images are processed correctly
  });
  
  test('prevents duplicate images', async () => {
    const imagesWithDuplicates = [
      { code: 'img1', url: 'http://example.com/img1.jpg' },
      { code: 'img1', url: 'http://example.com/img1.jpg' } // Duplicate
    ];
    await handleAfterUpload(imagesWithDuplicates);
    // Assert only one image is added
  });
});
```

### Integration Tests
```javascript
test('bulk upload workflow', async () => {
  // Test complete workflow from file selection to gallery update
  const files = [file1, file2, file3];
  const uploadedImages = await uploadFiles(files);
  
  // Should handle array of images
  expect(Array.isArray(uploadedImages)).toBe(true);
  
  // Should update gallery with all images
  await handleAfterUpload(uploadedImages);
  expect(imageList).toHaveLength(3);
});
```

## Migration Guide

### For Existing Users
No changes required - the enhancement is fully backward compatible.

### For New Features
```javascript
// Old way (still works)
handleAfterUpload(singleImage);

// New way (enhanced)
handleAfterUpload([image1, image2, image3]);
```

This enhancement provides a robust foundation for bulk image upload functionality while maintaining full backward compatibility with existing implementations.
