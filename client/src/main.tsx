import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "./lib/redux/store";
import { Stack, CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./lib/mui/theme";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import OfflineAlert from "./components/offline-alert";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <OfflineAlert />
        <Stack spacing={2} sx={{ width: 1200, mx: "auto" }}>
          <App />
        </Stack>
      </ThemeProvider>
    </PersistGate>
  </ReduxProvider>
);
