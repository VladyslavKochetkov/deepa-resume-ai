import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { chromium } from "playwright-core";
import { useState } from "react";
import path from "node:path";

console.log(
  path.join(Bun.main, "..", "..", "assets", "extensions", "ublockOrigin.crx")
);

const extensionFolder = path.join(Bun.main, "..", "..", "assets", "extensions");

const extensions = ["ublockOrigin", "grammarly"];

const extensionsAsSinglePath = extensions
  .map((ext) => path.join(extensionFolder, ext))
  .join(",");

export const Creation = () => {
  const [value, setValue] = useState("");
  return (
    <Box flexDirection="column">
      <Box>
        <Text>Welcome to the Resume Creation Page!</Text>
        <TextInput
          placeholder="Press enter to launch browser for usage or enter a URL to open to"
          value={value}
          onChange={setValue}
          onSubmit={async (value) => {
            if (value.trim() === "") {
              console.log("Launching browser for usage...");
              console.log("Extension path:", extensionsAsSinglePath);

              const context = await chromium.launchPersistentContext(
                "./user-profile",
                {
                  headless: false,
                  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                  args: [
                    "--disable-blink-features=AutomationControlled",
                    "--disable-extensions-except=" + extensionsAsSinglePath,
                    "--load-extension=" + extensionsAsSinglePath,
                    "--enable-extensions",
                    "--no-first-run",
                    "--disable-dev-shm-usage",
                    "--exclude-switches=enable-automation",
                    "--disable-automation",
                    "--disable-features=VizDisplayCompositor"
                  ],
                }
              );

              const page = await context.newPage();
              
              await page.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                  get: () => undefined,
                });
              });
              await page.goto("https://google.com"); // Replace with your app URL
            } else {
              console.log(`Opening URL: ${value}`);
              // Here you would typically open the provided URL
            }
          }}
        />
      </Box>
    </Box>
  );
};
