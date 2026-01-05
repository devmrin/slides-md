/**
 * Global application constants
 */

// Presentation limits
export const MAX_PRESENTATIONS = 50;

// Media library limits
export const MAX_MEDIA_ITEMS = 100;
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 5MB in bytes

// Allowed image types
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

