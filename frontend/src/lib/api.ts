/** Centralized API configuration - single source of truth for all API URLs */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** Get full URL for uploaded files (images, PDFs) stored in /uploads */
export const getUploadUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `${UPLOADS_BASE_URL}${url}`;
  }
  return url;
};
