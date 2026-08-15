export type ReferenceRole =
  | "uniform"
  | "model_pose"
  | "environment"
  | "props_object"
  | "visual_style"
  | "logo_identity"
  | "other";

export interface ReferenceRoleOption {
  id: ReferenceRole;
  label: string;
  description: string;
}

export interface ReferenceItem {
  id: string; // Stable ID: REF-01, REF-02, etc.
  file?: File; // Client-side File object
  previewUrl: string;
  role: ReferenceRole;
  roleDescription?: string; // Required if role === "other"
  userNotes?: string;
}

export interface ReferenceGuideItem {
  referenceId: string;
  role: ReferenceRole;
  uploadOrder: number;
  instruction: string;
}
