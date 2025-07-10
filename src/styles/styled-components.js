import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/**
 * Styled component for image containers with enhanced hover effects
 */
export const StyledImageContainer = styled(Box)(({ theme }) => ({
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
}));

/**
 * Styled component for image overlay with action buttons
 */
export const ImageOverlay = styled(Box)(({ theme }) => ({
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
}));

/**
 * Styled component for modal container
 */
export const StyledModalContainer = styled(Box)(({ theme, isMobile }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isMobile ? '95vw' : '90vw',
  maxWidth: 1200,
  height: isMobile ? '95vh' : '90vh',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 24
}));

/**
 * Styled component for modal header
 */
export const StyledModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.95)
}));

/**
 * Styled component for modal body
 */
export const StyledModalBody = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.grey[50]
}));

/**
 * Styled component for modal footer
 */
export const StyledModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.95)
}));

/**
 * Styled component for empty state container
 */
export const StyledEmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  minHeight: 300
}));

/**
 * Styled component for image grid container
 */
export const StyledImageGridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  minHeight: 200
}));
