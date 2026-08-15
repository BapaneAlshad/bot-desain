import { APP_LIMITS } from "@/config/appLimits";

export interface ImageValidationError {
  isValid: false;
  error: string;
}

export interface ImageValidationSuccess {
  isValid: true;
}

export type ImageValidationResult = ImageValidationError | ImageValidationSuccess;

export function validateImageFile(file: File | Blob, fileName?: string): ImageValidationResult {
  if (file.size > APP_LIMITS.MAX_FILE_SIZE_BYTES) {
    const sizeMB = (APP_LIMITS.MAX_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `File ${fileName ? `"${fileName}" ` : ""}exceeds maximum allowed size of ${sizeMB}MB.`,
    };
  }

  const mimeType = file.type.toLowerCase();
  if (mimeType && !APP_LIMITS.ALLOWED_IMAGE_TYPES.includes(mimeType as "image/jpeg" | "image/png" | "image/webp")) {
    return {
      isValid: false,
      error: `Invalid file format for ${fileName ? `"${fileName}"` : "image"}. Allowed formats: JPG, PNG, WEBP.`,
    };
  }

  return { isValid: true };
}
