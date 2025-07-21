import { render, Text } from "ink";
import { App } from "./App";

process.stdin.resume();
await render(<App />).waitUntilExit();
