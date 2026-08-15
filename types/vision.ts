import { ReferenceRole } from "./references";

export interface VisionReferenceAnalysis {
  id: string; // e.g. REF-01
  role: ReferenceRole;
  observations: string[];
  preserve: string[];
  avoidAssuming: string[];
  confidence: "high" | "medium" | "low";
  notesApplied?: string;
}

export interface VisionSummary {
  analyzedCount: number;
  findings: VisionReferenceAnalysis[];
  overallNotes?: string;
}
