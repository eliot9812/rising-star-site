/** Centralized API configuration - single source of truth for all API URLs */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// VITE_UPLOADS_URL = backend base without /api, e.g. https://therisingenglishschool.com
// Falls back to stripping /api from VITE_API_URL, or '' for local dev (uses relative URLs)
export const UPLOADS_BASE_URL: string =
  import.meta.env.VITE_UPLOADS_URL ||
  (import.meta.env.VITE_API_URL
    ? (import.meta.env.VITE_API_URL as string).replace(/\/api$/, '')
    : '');

/** Get full URL for uploaded files (images, PDFs) stored in /uploads */
export const getUploadUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `${UPLOADS_BASE_URL}${url}`;
  }
  return url;
};
