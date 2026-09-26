import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fixtures, readFixture } from "../../fixtures/index.js";
import {
  buildTestApp,
  createMultipartPayload,
  loginAsAdmin,
  type TestApp,
} from "../test-server.js";

let testApp: TestApp;
let token: string;

beforeAll(async () => {
  testApp = await buildTestApp();
  token = await loginAsAdmin(testApp.app);
}, 30_000);

afterAll(async () => {
  await testApp.cleanup();
}, 10_000);

describe("compress-image-to-N-kb presets", () => {
  // The fixture is ~87 KB, so both targets force real compression work.
  it.each([
    ["compress-image-to-20kb", 20],
    ["compress-image-to-50kb", 50],
  ])(
    "%s lands under its locked target even when settings ask for max quality",
    async (toolId, targetKb) => {
      const input = readFixture(fixtures.image.portrait.jpg);
      const { body, contentType } = createMultipartPayload([
        { name: "file", filename: "input.jpg", contentType: "image/jpeg", content: input },
        { name: "settings", content: JSON.stringify({ mode: "quality", quality: 100 }) },
      ]);
      const res = await testApp.app.inject({
        method: "POST",
        url: `/api/v1/tools/image/${toolId}`,
        headers: { authorization: `Bearer ${token}`, "content-type": contentType },
        body,
      });

      expect(res.statusCode, res.body.slice(0, 500)).toBe(200);
      const json = JSON.parse(res.body);
      expect(json.originalSize).toBe(input.length);
      expect(json.processedSize).toBeGreaterThan(0);
      expect(json.processedSize).toBeLessThanOrEqual(targetKb * 1024);
    },
    60_000,
  );
});
