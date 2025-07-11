import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Stack, Chip, Button } from '@mui/material';
import {
  Image as ImageIcon,
  CloudUpload as UploadIcon,
  ContentPaste as PasteIcon,
  Link as LinkIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { StyledEmptyStateContainer } from '../styles/styled-components';

/**
 * Empty state component for image gallery
 */
const ImageGalleryEmptyState = ({
  emptyMessage,
  updatable = false,
  clipboardSupported = false,
  onAddImage = () => {}
}) => {
  return (
    <StyledEmptyStateContainer>
      <Stack spacing={3} alignItems="center">
        <ImageIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>

        {updatable && (
          <>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAddImage} sx={{ mt: 2 }}>
              Agregar imagen
            </Button>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
              <Chip
                icon={<UploadIcon />}
                label="Subir archivo"
                variant="outlined"
                size="small"
                onClick={onAddImage}
              />

              {clipboardSupported && (
                <Chip
                  icon={<PasteIcon />}
                  label="Pegar (Ctrl+V)"
                  variant="outlined"
                  size="small"
                  color="secondary"
                />
              )}

              <Chip
                icon={<LinkIcon />}
                label="Desde URL"
                variant="outlined"
                size="small"
                color="info"
              />
            </Stack>

            <Typography variant="caption" color="text.secondary" textAlign="center">
              Soporta múltiples métodos de carga: archivos, portapapeles y URLs
            </Typography>
          </>
        )}
      </Stack>
    </StyledEmptyStateContainer>
  );
};

ImageGalleryEmptyState.propTypes = {
  emptyMessage: PropTypes.string.isRequired,
  updatable: PropTypes.bool,
  clipboardSupported: PropTypes.bool,
  onAddImage: PropTypes.func
};

export default ImageGalleryEmptyState;
