import { ReferenceRole, ReferenceRoleOption } from "@/types";

export const REFERENCE_ROLE_OPTIONS: ReferenceRoleOption[] = [
  {
    id: "uniform",
    label: "Uniform / Clothing",
    description: "Shirt, apron, uniform shape, dominant clothing colors or embroidery placement.",
  },
  {
    id: "model_pose",
    label: "Model / Pose",
    description: "Body stance, arm position, gesture, expression, or physical posture.",
  },
  {
    id: "environment",
    label: "Environment / Background",
    description: "Interior design, warehouse layout, office atmosphere, wall colors, lighting.",
  },
  {
    id: "props_object",
    label: "Props / Object",
    description: "Tools, coffee machine, clipboard, laptop, boxes, or equipment featured.",
  },
  {
    id: "visual_style",
    label: "Visual Style",
    description: "Photography style, color grading, artistic mood, contrast, texture.",
  },
  {
    id: "logo_identity",
    label: "Logo / Visual Identity",
    description: "Emblem shape, brand badge, or color accent guidelines.",
  },
  {
    id: "other",
    label: "Other",
    description: "Custom reference element (requires description note).",
  },
];

export function getRoleLabel(role: ReferenceRole): string {
  const found = REFERENCE_ROLE_OPTIONS.find((r) => r.id === role);
  return found ? found.label : role;
}
