import { IMAGE_INPUTS } from "./modality.js";
import type { Tool } from "./types.js";

export interface CompressPreset {
  id: string;
  sizeKb: number;
  targetSizeKb: number;
  label: string;
  name: string;
  description: string;
  base: "compress";
  locked: {
    mode: "targetSize";
    targetSizeKb: number;
  };
  lockedSettings: {
    mode: "targetSize";
    targetSizeKb: number;
  };
  sourceInputs: string[];
}

export const COMPRESS_PRESETS: CompressPreset[] = [
  {
    id: "compress-image-to-20kb",
    sizeKb: 20,
    targetSizeKb: 20,
    label: "20 KB",
    name: "Compress Image to 20 KB",
    description: "Compress image file size to under 20 KB",
    base: "compress",
    locked: { mode: "targetSize", targetSizeKb: 20 },
    lockedSettings: { mode: "targetSize", targetSizeKb: 20 },
    sourceInputs: IMAGE_INPUTS,
  },
  {
    id: "compress-image-to-50kb",
    sizeKb: 50,
    targetSizeKb: 50,
    label: "50 KB",
    name: "Compress Image to 50 KB",
    description: "Compress image file size to under 50 KB",
    base: "compress",
    locked: { mode: "targetSize", targetSizeKb: 50 },
    lockedSettings: { mode: "targetSize", targetSizeKb: 50 },
    sourceInputs: IMAGE_INPUTS,
  },
  {
    id: "compress-image-to-100kb",
    sizeKb: 100,
    targetSizeKb: 100,
    label: "100 KB",
    name: "Compress Image to 100 KB",
    description: "Compress image file size to under 100 KB",
    base: "compress",
    locked: { mode: "targetSize", targetSizeKb: 100 },
    lockedSettings: { mode: "targetSize", targetSizeKb: 100 },
    sourceInputs: IMAGE_INPUTS,
  },
  {
    id: "compress-image-to-200kb",
    sizeKb: 200,
    targetSizeKb: 200,
    label: "200 KB",
    name: "Compress Image to 200 KB",
    description: "Compress image file size to under 200 KB",
    base: "compress",
    locked: { mode: "targetSize", targetSizeKb: 200 },
    lockedSettings: { mode: "targetSize", targetSizeKb: 200 },
    sourceInputs: IMAGE_INPUTS,
  },
  {
    id: "compress-image-to-500kb",
    sizeKb: 500,
    targetSizeKb: 500,
    label: "500 KB",
    name: "Compress Image to 500 KB",
    description: "Compress image file size to under 500 KB",
    base: "compress",
    locked: { mode: "targetSize", targetSizeKb: 500 },
    lockedSettings: { mode: "targetSize", targetSizeKb: 500 },
    sourceInputs: IMAGE_INPUTS,
  },
];

export const COMPRESS_PRESET_BY_ID: Record<string, CompressPreset> = Object.fromEntries(
  COMPRESS_PRESETS.map((p) => [p.id, p]),
);

export function expandCompressPresets(baseTools?: Pick<Tool, "id" | "executionHint">[]): Tool[] {
  const base = baseTools?.find((t) => t.id === "compress");
  const executionHint = base?.executionHint ?? "fast";
  return COMPRESS_PRESETS.map((p) => {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      category: "essentials",
      icon: "Minimize2",
      route: `/${p.id}`,
      modality: "image",
      acceptedInputs: p.sourceInputs,
      executionHint,
      keywords: [
        `compress image to ${p.sizeKb}kb`,
        `compress image to ${p.sizeKb} kb`,
        `compress image ${p.sizeKb}kb`,
        `compress image ${p.sizeKb} kb`,
        `compress to ${p.sizeKb}kb`,
        `compress to ${p.sizeKb} kb`,
        `${p.sizeKb}kb`,
        `${p.sizeKb} kb`,
        `image under ${p.sizeKb}kb`,
        `reduce image to ${p.sizeKb}kb`,
        `reduce photo size to ${p.sizeKb}kb`,
      ],
    } satisfies Tool;
  });
}
