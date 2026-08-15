export const APP_LIMITS = {
  MAX_REFERENCE_IMAGES: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  HERMES_TIMEOUT_MS: 120000, // 2 minutes timeout for LLM reasoning & vision
} as const;
