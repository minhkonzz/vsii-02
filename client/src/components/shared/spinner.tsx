import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

interface SpinnerProps {
  text?: string;
  size?: number;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}

const StyledSpinner = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

export default function Spinner({
  text = "Loading...",
  size = 24,
  color = "primary",
}: SpinnerProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingY={2}
    >
      <StyledSpinner size={size} color={color} />
      <span>{text}</span>
    </Box>
  );
}
