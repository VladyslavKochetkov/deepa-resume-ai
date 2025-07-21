import { TextInput } from "@inkjs/ui";
import { Box, Text, useStdin } from "ink";
import { MemoryRouter, Route, Router, Routes } from "react-router";
import { Landing } from "./Pages/Landing";
import { HealthCheck } from "./Pages/HealthCheck";
import { Creation } from "./Pages/Creation";

export const App = () => {
  const { stdin } = useStdin();

  if (!stdin.isTTY) {
    console.error("This application requires a TTY input.");
    process.exit(1);
  }

  return (
    <MemoryRouter basename="/">
      <Routes>
        <Route path="/" element={<HealthCheck />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/create" element={<Creation />} />
      </Routes>
      {/* <Box flexDirection="column">
        <Text>Welcome to Resume Builder - powered by ✨ Gemini AI ✨</Text>
        <Box borderStyle="round" paddingX={1}>
          <LandingTextbox />
        </Box>
      </Box> */}
    </MemoryRouter>
  );
};
