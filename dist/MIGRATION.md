# GoalImageGallery Migration Guide

## Overview

This guide helps you migrate from older image gallery components to the new enhanced `GoalImageGallery` component.

## Migration Scenarios

### 1. From CommonImageGallery

#### Before
```javascript
import { CommonImageGallery } from './components/common/common-image-gallery';

<CommonImageGallery
  photos={photos}
  sizeImage="200px"
  canEdit={true}
  onSelectImage={handleImageSelect}
/>
```

#### After
```javascript
import GoalImageGallery from './components/common/goal-image-gallery';

<GoalImageGallery
  imageCodes={photos.map(p => p.image_code)}
  canEdit={true}
  ownerEntity={{ id: entityId, type: 'entity' }}
  imageHandlerApi={handleImageUpload}
  afterUpload={refreshData}
  multiple={true}
/>
```

#### Changes Required
- Replace `photos` array with `imageCodes` array
- Add `ownerEntity` object with entity information
- Replace `onSelectImage` with `imageHandlerApi` for uploads
- Add `afterUpload` callback for refresh logic
- Remove `sizeImage` prop (now responsive)

### 2. From Basic Image Display

#### Before
```javascript
<div className="image-gallery">
  {images.map(image => (
    <img
      key={image.id}
      src={image.url}
      alt={image.title}
      onClick={() => openModal(image)}
    />
  ))}
</div>
```

#### After
```javascript
<GoalImageGallery
  imageCodes={images.map(img => img.code)}
  canEdit={false}
  showImageInfo={true}
/>
```

#### Changes Required
- Convert image URLs to image codes
- Remove manual modal handling (built-in)
- Remove custom CSS (uses Material-UI)
- Add proper prop structure

### 3. From react-photo-gallery

#### Before
```javascript
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

<Gallery
  photos={photos}
  onClick={openLightbox}
/>
<Lightbox
  images={photos}
  onClose={closeLightbox}
  isOpen={lightboxIsOpen}
/>
```

#### After
```javascript
<GoalImageGallery
  imageCodes={photos.map(p => p.image_code)}
  canEdit={true}
  ownerEntity={{ id: entityId }}
  imageHandlerApi={handleUpload}
  afterUpload={refreshData}
  multiple={true}
/>
```

#### Changes Required
- Remove separate Lightbox component
- Convert photo format to image codes
- Add upload functionality
- Remove manual state management

### 4. From ImageUploader Components

#### Before
```javascript
import { ImageUploader } from './components/common/image-uploader';

<ImageUploader
  objType={objType}
  docEntry={docEntry}
  maxFiles={10}
  onUpload={handleUpload}
/>
```

#### After
```javascript
<GoalImageGallery
  imageCodes={existingImages}
  canEdit={true}
  ownerEntity={{ id: docEntry, type: objType }}
  imageHandlerApi={handleUpload}
  afterUpload={refreshData}
  multiple={true}
/>
```

#### Changes Required
- Combine display and upload functionality
- Update prop structure
- Modify upload handler to return proper format

## Data Format Changes

### Photo/Image Object Format

#### Old Format
```javascript
const photos = [
  {
    id: 1,
    src: 'https://example.com/image1.jpg',
    width: 800,
    height: 600,
    title: 'Image 1'
  }
];
```

#### New Format
```javascript
const imageCodes = ['img_code_1', 'img_code_2'];
// OR
const imageCodes = 'img_code_1,img_code_2';
```

### Upload Handler Format

#### Old Format
```javascript
const handleUpload = async (files) => {
  const uploaded = await uploadFiles(files);
  setImages(prev => [...prev, ...uploaded]);
};
```

#### New Format
```javascript
const handleUpload = async (imageData) => {
  try {
    const response = await api.uploadImage(imageData);
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

## API Changes

### Upload API Structure

#### Old API Call
```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

#### New API Call
```javascript
const handleImageUpload = async (imageData) => {
  const response = await goalMediaApi.submitImage({
    values: {
      data: imageData.base64,
      name: imageData.name,
      type: imageData.type,
      application: 'GOAL',
      folder: 'uploads',
      owner: account.userName
    }
  });
  
  return {
    success: response.success,
    data: response.data,
    message: response.message
  };
};
```

## Step-by-Step Migration

### Step 1: Install Dependencies
```bash
# Ensure you have required dependencies
npm install @mui/material @mui/icons-material
npm install react-dropzone
```

### Step 2: Update Imports
```javascript
// Remove old imports
// import { CommonImageGallery } from './common-image-gallery';
// import Gallery from 'react-photo-gallery';

// Add new import
import GoalImageGallery from './components/common/goal-image-gallery';
```

### Step 3: Convert Data Format
```javascript
// Convert your existing data
const convertPhotosToImageCodes = (photos) => {
  return photos.map(photo => photo.image_code || photo.id);
};

const imageCodes = convertPhotosToImageCodes(existingPhotos);
```

### Step 4: Update Component Usage
```javascript
// Old component
<OldImageGallery
  photos={photos}
  onUpload={handleUpload}
  canEdit={canEdit}
/>

// New component
<GoalImageGallery
  imageCodes={imageCodes}
  canEdit={canEdit}
  ownerEntity={{ id: entityId, type: 'entity' }}
  imageHandlerApi={handleNewUpload}
  afterUpload={refreshData}
  multiple={true}
/>
```

### Step 5: Update Upload Handler
```javascript
// Update your upload handler
const handleNewUpload = async (imageData) => {
  try {
    // Your existing upload logic
    const result = await uploadToServer(imageData);
    
    // Return required format
    return {
      success: true,
      data: { code: result.imageCode },
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

### Step 6: Update State Management
```javascript
// Update your state management
const [images, setImages] = useState([]);

const refreshData = (result) => {
  // Update your state with new image
  setImages(prev => [...prev, result.data.code]);
};
```

## Common Migration Issues

### Issue 1: Image URLs vs Image Codes
**Problem**: Old components used direct image URLs
**Solution**: Convert URLs to image codes using your backend API

```javascript
// Convert URL to code
const getImageCodeFromUrl = (url) => {
  return url.split('/').pop().split('.')[0];
};
```

### Issue 2: Different Upload Response Format
**Problem**: Old upload handlers returned different formats
**Solution**: Wrap existing handlers to return required format

```javascript
const wrapOldUploadHandler = (oldHandler) => {
  return async (imageData) => {
    try {
      const result = await oldHandler(imageData);
      return {
        success: true,
        data: { code: result.id },
        message: 'Upload successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  };
};
```

### Issue 3: State Management Changes
**Problem**: Component now manages its own state
**Solution**: Use callbacks to sync external state

```javascript
const [externalImages, setExternalImages] = useState([]);

const syncWithExternalState = (result) => {
  setExternalImages(prev => [...prev, result.data.code]);
};

<GoalImageGallery
  imageCodes={externalImages}
  afterUpload={syncWithExternalState}
  // ... other props
/>
```

## Testing After Migration

### 1. Visual Testing
- [ ] Images display correctly
- [ ] Gallery layout is responsive
- [ ] Hover effects work
- [ ] Modal viewer opens/closes

### 2. Functionality Testing
- [ ] File upload works
- [ ] Clipboard paste works (if supported)
- [ ] URL loading works
- [ ] Image deletion works
- [ ] Download functionality works

### 3. Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] ARIA labels present

### 4. Performance Testing
- [ ] Large galleries load quickly
- [ ] Memory usage is reasonable
- [ ] No memory leaks
- [ ] Smooth animations

## Rollback Plan

If you need to rollback:

1. Keep old components until migration is complete
2. Use feature flags to switch between old/new
3. Test thoroughly before removing old code
4. Document any custom modifications

```javascript
// Feature flag approach
const useNewGallery = process.env.REACT_APP_NEW_GALLERY === 'true';

return useNewGallery ? (
  <GoalImageGallery {...newProps} />
) : (
  <OldImageGallery {...oldProps} />
);
```

## Support

For migration support:
- Check the documentation
- Review the examples
- Test with small datasets first
- Verify API compatibility
- Update error handling
