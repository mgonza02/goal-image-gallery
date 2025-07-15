import PropTypes from 'prop-types';
import {
  Modal,
  Zoom,
  Backdrop,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import {
  getModalContainerStyles,
  getModalHeaderStyles,
  getModalBodyStyles,
  getModalFooterStyles
} from '../styles/styled-components';
import { handleImageError } from '../utils/image-utils';

/**
 * Image modal component for full-screen image viewing
 */
const ImageGalleryModal = ({
  open,
  imageUrl,
  imageList,
  selectedImageIndex,
  zoomLevel,
  noImageUrl,
  onClose,
  onZoomIn,
  onZoomOut,
  onPreviousImage,
  onNextImage
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
        }
      }}
    >
      <Zoom in={open}>
        <Box sx={getModalContainerStyles(theme, isMobile)}>
          {/* Modal Header */}
          <Box sx={getModalHeaderStyles(theme)}>
            <Typography variant="h6">
              Imagen {selectedImageIndex + 1} de {imageList.length}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Alejar">
                <IconButton onClick={onZoomOut} disabled={zoomLevel <= 0.5}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Chip label={`${Math.round(zoomLevel * 100)}%`} variant="outlined" size="small" />
              <Tooltip title="Acercar">
                <IconButton onClick={onZoomIn} disabled={zoomLevel >= 3}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cerrar">
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Modal Body */}
          <Box sx={getModalBodyStyles(theme)}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: zoomLevel > 1 ? 'auto' : 'hidden',
                p: 2
              }}
            >
              <img
                src={imageUrl}
                alt="Imagen completa"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-in-out',
                  borderRadius: 8,
                  display: 'block'
                }}
                onError={(e) => handleImageError(e, noImageUrl)}
              />
            </Box>
          </Box>

          {/* Modal Footer */}
          {imageList.length > 1 && (
            <Box sx={getModalFooterStyles(theme)}>
              <Tooltip title="Imagen anterior">
                <IconButton onClick={onPreviousImage} disabled={imageList.length <= 1}>
                  <ChevronLeftIcon />
                </IconButton>
              </Tooltip>

              <Typography variant="body2" color="text.secondary">
                Use las flechas del teclado para navegar
              </Typography>

              <Tooltip title="Imagen siguiente">
                <IconButton onClick={onNextImage} disabled={imageList.length <= 1}>
                  <ChevronRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Zoom>
    </Modal>
  );
};

ImageGalleryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string,
  imageList: PropTypes.array.isRequired,
  selectedImageIndex: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  noImageUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onPreviousImage: PropTypes.func.isRequired,
  onNextImage: PropTypes.func.isRequired
};
export default ImageGalleryModal;
