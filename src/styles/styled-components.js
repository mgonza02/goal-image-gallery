import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Styles for image containers with enhanced hover effects
 */
export const getImageContainerStyles = (theme) => ({
  position: 'relative',
  borderRadius: theme.spacing(1.5),
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
    duration: theme.transitions.duration.short
  }),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
    '& .image-overlay': {
      opacity: 1
    }
  }
});

/**
 * Styles for image overlay with action buttons
 */
export const getImageOverlayStyles = (theme) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: alpha(theme.palette.common.black, 0.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short
  }),
  '& .MuiIconButton-root': {
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.common.black, 0.7),
    margin: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.9)
    }
  }
});

/**
 * Styles for modal container
 */
export const getModalContainerStyles = (theme, isMobile) => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) !important',
  position: 'absolute',
  width: isMobile ? '95vw' : '90vw',
  maxWidth: 1200,
  height: isMobile ? '95vh' : '90vh',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 24
});

/**
 * Styles for modal header
 */
export const getModalHeaderStyles = (theme) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.95)
});

/**
 * Styles for modal body
 */
export const getModalBodyStyles = (theme) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.grey[50]
});

/**
 * Styles for modal footer
 */
export const getModalFooterStyles = (theme) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.95)
});

/**
 * Styles for empty state container
 */
export const getEmptyStateContainerStyles = (theme) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  minHeight: 300
});

/**
 * Styles for image grid container
 */
export const getImageGridContainerStyles = (theme) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  minHeight: 200
});

// Legacy styled components exports for backward compatibility
export const StyledImageContainer = Box;
export const ImageOverlay = Box;
export const StyledModalContainer = Box;
export const StyledModalHeader = Box;
export const StyledModalBody = Box;
export const StyledModalFooter = Box;
export const StyledEmptyStateContainer = Box;
export const StyledImageGridContainer = Box;
