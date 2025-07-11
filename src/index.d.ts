import { ReactNode } from 'react';

// Main component props
export interface GoalImageGalleryProps {
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
  getImageUrl?: (params: { imageCode: string; thumbMail?: boolean }) => string;
  noImageUrl?: string;
  showError?: (message: string) => void;
  hasPermission?: (permission: string) => boolean;
  currentCompany?: string;
  slot?: Object; // Slot component for custom rendering
  slotProps?: Object; // Props for the slot component
}

// Image item interface
export interface ImageItem {
  id: number;
  width: number;
  height: number;
  title: string;
  image_code: string;
}

// Hook interfaces
export interface UseImageGalleryOptions {
  imageCodes?: string | string[];
  multiple?: boolean;
  canEdit?: boolean;
  updatable?: boolean;
  imageHandlerApi?: (data: any) => Promise<any>;
  ownerEntity?: object;
  currentCompany?: string;
  onRefresh?: (result: any) => void;
  showError?: (message: string) => void;
}

export interface UseImageGalleryReturn {
  openImage: string | null;
  selectedImageIndex: number;
  selectingImage: boolean;
  imageList: ImageItem[];
  selectedImage: ImageItem | null;
  zoomLevel: number;
  loading: boolean;
  removable: boolean;
  setZoomLevel: (level: number) => void;
  handleOpenImage: (imageUrl: string, index?: number) => void;
  handleCloseImage: () => void;
  handleImageSelect: (image: ImageItem | null) => void;
  handleCancel: () => void;
  handleRemoveImage: (image: ImageItem) => Promise<void>;
  handleAfterUpload: (image: any) => Promise<void>;
}

export interface UseImageZoomReturn {
  zoomLevel: number;
  selectedImageIndex: number;
  setZoomLevel: (level: number) => void;
  setSelectedImageIndex: (index: number) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handlePreviousImage: () => string;
  handleNextImage: () => string;
}

export interface UseClipboardReturn {
  clipboardSupported: boolean;
}

// Component props interfaces
export interface ImageGalleryGridProps {
  imageList: ImageItem[];
  emptyMessage: string;
  multiple?: boolean;
  updatable?: boolean;
  removable?: boolean;
  allowDownload?: boolean;
  showImageInfo?: boolean;
  loading?: boolean;
  clipboardSupported?: boolean;
  getImageUrl: (params: { imageCode: string; thumbMail?: boolean }) => string;
  noImageUrl: string;
  onImageClick: (imageUrl: string, index: number) => void;
  onImageSelect: (image: ImageItem | null) => void;
  onRemoveImage: (image: ImageItem) => void;
  onDownloadImage: (imageCode: string) => void;
}

export interface ImageGalleryModalProps {
  open: boolean;
  imageUrl?: string | null;
  imageList: ImageItem[];
  selectedImageIndex: number;
  zoomLevel: number;
  noImageUrl: string;
  onClose: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousImage: () => void;
  onNextImage: () => void;
}

export interface ImageGalleryItemProps {
  image: ImageItem;
  index: number;
  getImageUrl: (params: { imageCode: string; thumbMail?: boolean }) => string;
  noImageUrl: string;
  loading?: boolean;
  updatable?: boolean;
  removable?: boolean;
  allowDownload?: boolean;
  showImageInfo?: boolean;
  onImageClick: (imageUrl: string, index: number) => void;
  onImageSelect: (image: ImageItem) => void;
  onRemoveImage: (image: ImageItem) => void;
  onDownloadImage: (imageCode: string) => void;
}

export interface ImageGalleryEmptyStateProps {
  emptyMessage: string;
  updatable?: boolean;
  clipboardSupported?: boolean;
  onAddImage?: () => void;
}

// Utility function types
export type HandleImageError = (e: Event, noImageUrl: string) => void;
export type DownloadImage = (imageUrl: string, imageCode: string) => void;
export type ProcessImageCodes = (imageCodes: string | string[]) => ImageItem[];
export type GetGridColumns = (isMobile: boolean, isTablet: boolean, multiple: boolean) => number;
export type IsValidImageFile = (file: File) => boolean;
export type FormatFileSize = (bytes: number) => string;
export type GenerateId = () => string;
export type Debounce = (func: Function, wait: number) => Function;
export type IsTouchDevice = () => boolean;
export type GetImageDimensions = (url: string) => Promise<{ width: number; height: number }>;
export type CreateImagePreview = (file: File) => Promise<string>;

// Hook functions
export declare function useImageGallery(options: UseImageGalleryOptions): UseImageGalleryReturn;
export declare function useImageZoom(
  getImageUrl: (params: { imageCode: string }) => string,
  imageList: ImageItem[]
): UseImageZoomReturn;
export declare function useClipboard(
  updatable: boolean,
  selectingImage: boolean,
  onPasteImage?: (file: File) => void
): UseClipboardReturn;
export declare function useKeyboardNavigation(
  openImage: string | null,
  onPreviousImage: () => void,
  onNextImage: () => void,
  onCloseImage: () => void,
  onZoomIn: () => void,
  onZoomOut: () => void
): void;

// Main component
declare const GoalImageGallery: React.FC<GoalImageGalleryProps>;
export default GoalImageGallery;

// Sub-components
export declare const ImageGalleryGrid: React.FC<ImageGalleryGridProps>;
export declare const ImageGalleryModal: React.FC<ImageGalleryModalProps>;
export declare const ImageGalleryItem: React.FC<ImageGalleryItemProps>;
export declare const ImageGalleryEmptyState: React.FC<ImageGalleryEmptyStateProps>;

// Utility functions
export declare const handleImageError: HandleImageError;
export declare const downloadImage: DownloadImage;
export declare const processImageCodes: ProcessImageCodes;
export declare const getGridColumns: GetGridColumns;
export declare const isValidImageFile: IsValidImageFile;
export declare const formatFileSize: FormatFileSize;
export declare const generateId: GenerateId;
export declare const debounce: Debounce;
export declare const isTouchDevice: IsTouchDevice;
export declare const getImageDimensions: GetImageDimensions;
export declare const createImagePreview: CreateImagePreview;
