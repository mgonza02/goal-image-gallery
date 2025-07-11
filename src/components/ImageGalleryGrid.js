import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ImageGalleryItem from './ImageGalleryItem';
import ImageGalleryEmptyState from './ImageGalleryEmptyState';
import { StyledImageGridContainer } from '../styles/styled-components';
import { getGridColumns } from '../utils/image-utils';

/**
 * Image grid component for displaying gallery images
 */
const ImageGalleryGrid = ({
  imageList,
  emptyMessage,
  multiple = false,
  updatable = false,
  removable = false,
  allowDownload = false,
  showImageInfo = false,
  loading = false,
  clipboardSupported = false,
  getImageUrl,
  noImageUrl,
  onImageClick,
  onImageSelect,
  onRemoveImage,
  onDownloadImage
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  if (imageList.length === 0) {
    return (
      <Card elevation={2}>
        <CardContent>
          <ImageGalleryEmptyState
            emptyMessage={emptyMessage}
            updatable={updatable}
            clipboardSupported={clipboardSupported}
            onAddImage={() => onImageSelect(null)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <StyledImageGridContainer>
          <Grid container spacing={2}>
            {imageList.map((image, index) => (
              <Grid
                key={image.id}
                item
                xs={getGridColumns(isMobile, isTablet, multiple)}
                sx={{ position: 'relative' }}
              >
                <ImageGalleryItem
                  image={image}
                  index={index}
                  getImageUrl={getImageUrl}
                  noImageUrl={noImageUrl}
                  loading={loading}
                  updatable={updatable}
                  removable={removable}
                  allowDownload={allowDownload}
                  showImageInfo={showImageInfo}
                  onImageClick={onImageClick}
                  onImageSelect={onImageSelect}
                  onRemoveImage={onRemoveImage}
                  onDownloadImage={onDownloadImage}
                />
              </Grid>
            ))}
          </Grid>
        </StyledImageGridContainer>
      </CardContent>
    </Card>
  );
};

ImageGalleryGrid.propTypes = {
  imageList: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  updatable: PropTypes.bool,
  removable: PropTypes.bool,
  allowDownload: PropTypes.bool,
  showImageInfo: PropTypes.bool,
  loading: PropTypes.bool,
  clipboardSupported: PropTypes.bool,
  getImageUrl: PropTypes.func.isRequired,
  noImageUrl: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired,
  onImageSelect: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  onDownloadImage: PropTypes.func.isRequired
};

export default ImageGalleryGrid;
