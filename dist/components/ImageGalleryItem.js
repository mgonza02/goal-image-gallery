import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  ChangeCircle as ChangeIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { StyledImageContainer, ImageOverlay } from '../styles/styled-components';
import { AddButton } from '../../../common/buttons/add-button';
import { DeleteButton } from '../../../common/buttons/delete-button';
import { handleImageError } from '../utils/image-utils';

/**
 * Individual image item component
 */
const ImageGalleryItem = ({
  image,
  index,
  getImageUrl,
  noImageUrl,
  loading,
  updatable,
  removable,
  allowDownload,
  showImageInfo,
  onImageClick,
  onImageSelect,
  onRemoveImage,
  onDownloadImage
}) => {
  const theme = useTheme();

  // Handle add button (+) image
  if (image.image_code === '+') {
    return (
      <StyledImageContainer
        sx={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'primary.main',
          backgroundColor: alpha(theme.palette.primary.main, 0.04)
        }}
      >
        <AddButton
          onClick={() => onImageSelect(null)}
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'transparent'
          }}
          tooltip="Agregar imagen"
        />
      </StyledImageContainer>
    );
  }

  return (
    <StyledImageContainer>
      {loading && <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />}

      <img
        key={image.image_code}
        src={getImageUrl({ imageCode: image.image_code, thumbMail: true })}
        alt={image.title || `Imagen ${index + 1}`}
        onClick={() => onImageClick(getImageUrl({ imageCode: image.image_code }), index)}
        onError={(e) => handleImageError(e, noImageUrl)}
        style={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          display: loading ? 'none' : 'block'
        }}
      />

      <ImageOverlay className="image-overlay">
        <Tooltip title="Ver imagen">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onImageClick(getImageUrl({ imageCode: image.image_code }), index);
            }}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>

        {allowDownload && (
          <Tooltip title="Descargar imagen">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadImage(image.image_code);
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}

        {updatable && (
          <Tooltip title="Cambiar imagen">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(image);
              }}
            >
              <ChangeIcon />
            </IconButton>
          </Tooltip>
        )}

        {removable && (
          <Tooltip title="Eliminar imagen">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <DeleteButton onConfirm={() => onRemoveImage(image)} size="small" iconOnly />
            </IconButton>
          </Tooltip>
        )}
      </ImageOverlay>

      {showImageInfo && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: alpha(theme.palette.common.black, 0.7),
            color: 'white',
            p: 1
          }}
        >
          <Typography variant="caption" noWrap>
            {image.title || `Imagen ${index + 1}`}
          </Typography>
        </Box>
      )}
    </StyledImageContainer>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  getImageUrl: PropTypes.func.isRequired,
  noImageUrl: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  updatable: PropTypes.bool,
  removable: PropTypes.bool,
  allowDownload: PropTypes.bool,
  showImageInfo: PropTypes.bool,
  onImageClick: PropTypes.func.isRequired,
  onImageSelect: PropTypes.func.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  onDownloadImage: PropTypes.func.isRequired
};

ImageGalleryItem.defaultProps = {
  loading: false,
  updatable: false,
  removable: false,
  allowDownload: false,
  showImageInfo: false
};

export default ImageGalleryItem;
