import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./lib/store";
import { Stack, CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./lib/mui/theme";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ReduxProvider store={store}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={2} sx={{ width: 1200, mx: "auto" }}>
        <App />
      </Stack>
    </ThemeProvider>
  </ReduxProvider>
);
