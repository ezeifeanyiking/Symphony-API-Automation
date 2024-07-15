import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "tests/API",
  projects: [
    {
      name: "Chromium",
      use: { browserName: "chromium" },
    },
  ],
};

export default config;
