import { describe, expect, it } from "vitest";
import {
  COMPRESS_PRESET_BY_ID,
  COMPRESS_PRESETS,
  expandCompressPresets,
} from "../../../packages/shared/src/compress-presets.js";
import { TOOLS } from "../../../packages/shared/src/constants.js";

describe("compress presets", () => {
  it("defines 5 presets with unique ids", () => {
    expect(COMPRESS_PRESETS.length).toBe(5);
    const ids = COMPRESS_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(5);
  });

  it("targets 20, 50, 100, 200, and 500 KB respectively", () => {
    const targets = COMPRESS_PRESETS.map((p) => p.targetSizeKb);
    expect(targets).toEqual([20, 50, 100, 200, 500]);
    for (const preset of COMPRESS_PRESETS) {
      expect(preset.lockedSettings.mode).toBe("targetSize");
      expect(preset.lockedSettings.targetSizeKb).toBe(preset.targetSizeKb);
    }
  });

  it("every expanded preset is a valid Tool with route, keywords, and image modality", () => {
    const expanded = expandCompressPresets(TOOLS);
    expect(expanded.length).toBe(5);
    for (const tool of expanded) {
      expect(tool.route).toBe(`/${tool.id}`);
      expect(tool.modality).toBe("image");
      expect(tool.category).toBe("essentials");
      expect(tool.executionHint).toBe("fast");
      expect(tool.keywords?.length).toBeGreaterThan(3);
    }
  });

  it("presets are present in the exported TOOLS catalog", () => {
    const toolIds = new Set(TOOLS.map((t) => t.id));
    for (const p of COMPRESS_PRESETS) {
      expect(toolIds.has(p.id)).toBe(true);
    }
  });

  it("preset keywords include the natural phrasing and target size variants", () => {
    const expanded = expandCompressPresets(TOOLS);
    const to50 = expanded.find((t) => t.id === "compress-image-to-50kb");
    expect(to50?.keywords).toContain("compress image to 50kb");
    expect(to50?.keywords).toContain("50 kb");
    expect(to50?.keywords).toContain("50kb");
  });

  it("COMPRESS_PRESET_BY_ID indexes all presets accurately", () => {
    for (const p of COMPRESS_PRESETS) {
      expect(COMPRESS_PRESET_BY_ID[p.id]).toBe(p);
    }
  });
});
