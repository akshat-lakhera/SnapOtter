import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const config = vi.hoisted(() => ({
  FILES_STORAGE_PATH: "",
  JOB_TIMEOUT_LONG_S: 7200,
  LIBREOFFICE_TIMEOUT_S: 120,
}));

vi.mock("../../../apps/api/src/config.js", () => ({
  env: config,
}));

vi.mock("../../../apps/api/src/db/index.js", () => ({
  db: { select: vi.fn() },
  schema: { userFiles: {} },
}));

vi.mock("@snapotter/doc-engine", () => ({
  convertDocument: vi.fn(),
  sofficeAvailable: vi.fn(),
}));

vi.mock("@snapotter/media-engine", () => ({
  runFfmpeg: vi.fn(),
  softwareEncoder: vi.fn((x) => x),
}));

let testDir: string;
let previewDir: string;

beforeEach(async () => {
  testDir = join(tmpdir(), `snapotter-preview-test-${randomUUID().slice(0, 8)}`);
  previewDir = join(testDir, ".previews");
  await mkdir(previewDir, { recursive: true });
  config.FILES_STORAGE_PATH = testDir;
  vi.resetModules();
});

afterEach(async () => {
  await rm(testDir, { recursive: true, force: true });
});

describe("deletePreview (#1320)", () => {
  it("unlinks .mp4, .mp3, and .pdf preview files for the file id", async () => {
    const { deletePreview } = await import("../../../apps/api/src/routes/file-preview.js");
    const fileId = "test-file-123";

    await writeFile(join(previewDir, `${fileId}.mp4`), "video-data");
    await writeFile(join(previewDir, `${fileId}.mp3`), "audio-data");
    await writeFile(join(previewDir, `${fileId}.pdf`), "pdf-data");
    await writeFile(join(previewDir, "other-file.mp4"), "other-data");

    await deletePreview(fileId);

    expect(existsSync(join(previewDir, `${fileId}.mp4`))).toBe(false);
    expect(existsSync(join(previewDir, `${fileId}.mp3`))).toBe(false);
    expect(existsSync(join(previewDir, `${fileId}.pdf`))).toBe(false);
    expect(existsSync(join(previewDir, "other-file.mp4"))).toBe(true);
  });

  it("is idempotent when preview files do not exist", async () => {
    const { deletePreview } = await import("../../../apps/api/src/routes/file-preview.js");
    await expect(deletePreview("nonexistent-file-id")).resolves.toBeUndefined();
  });
});
