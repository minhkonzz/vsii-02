import { Stack, Box, ThemeProvider, createTheme } from "@mui/material";
import { BreedItem } from "./components/breed-item";
import { fetchBreeds, selectBreeds } from "./lib/slices/breedSlice";
import { useFetchWithThunk } from "./hooks/use-fetch-with-thunk";
import type { Breed } from "./types";
import Button from "./components/shared/button";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#2d2d2d",
          border: "1px solid #404040",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
  },
});

function App() {
  const {
    state: { breeds },
    loading,
    error,
  } = useFetchWithThunk(fetchBreeds, selectBreeds);

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Error: {error}
      </div>
    );
  }

  if (!breeds.length) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        No breeds found
      </div>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={2} direction="row">
        <Button variant="contained">Add Breed</Button>
      </Stack>
      <Stack spacing={{ xs: 1, sm: 2 }} sx={{ px: 50 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {breeds.map((breed: Breed) => (
            <BreedItem key={breed.id} breed={breed} />
          ))}
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
