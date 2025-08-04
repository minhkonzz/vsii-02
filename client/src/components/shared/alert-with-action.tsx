import { Alert, Button } from "@mui/material";

type Severity = 'error' | 'info' | 'success' | 'warning';

type ActionTextMap = {
  [K in Severity]?: string;
};

interface AlertWithActionProps {
  /**
   * The severity of the alert. This determines the color and icon used.
   * @default 'info'
   */
  severity: Severity;
  /**
   * The message to display in the alert
   */
  message: string;
  /**
   * Callback function when the action button is clicked
   */
  onAction: () => void;
  /**
   * Optional class name for the alert
   */
  className?: string;
  /**
   * Optional test ID for testing purposes
   */
  testId?: string;
  /**
   * Object mapping severity levels to button text
   * @default {
   *   info: 'Continue to fetch',
   *   error: 'Retry',
   *   success: 'OK',
   *   warning: 'Proceed'
   * }
   */
  actionTexts?: ActionTextMap;
}

const defaultActionTexts: ActionTextMap = {
  info: 'Continue to fetch',
  error: 'Retry',
  success: 'OK',
  warning: 'Proceed'
};

/**
 * A customizable Alert component with an action button.
 * The button text is determined by the alert's severity and can be customized
 * using the actionTexts prop.
 */
export const AlertWithAction = ({
  severity = 'info',
  message,
  onAction,
  className = '',
  testId = 'alert-with-action',
  actionTexts = {},
}: AlertWithActionProps) => {
  const mergedActionTexts = { ...defaultActionTexts, ...actionTexts };
  const actionText = mergedActionTexts[severity] || 'Action';

  return (
    <Alert
      data-testid={testId}
      className={className}
      severity={severity}
      sx={{ '& .MuiAlert-action': { alignItems: 'center' } }}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={onAction}
          sx={{
            backgroundColor: (theme) => 
              theme.palette.mode === 'light'
                ? theme.palette[severity].light
                : theme.palette[severity].dark,
            '&:hover': {
              backgroundColor: (theme) => 
                theme.palette.mode === 'light'
                  ? theme.palette[severity].main
                  : theme.palette[severity].light,
            },
            textTransform: 'none',
            padding: '4px 8px',
            borderRadius: 1,
          }}
        >
          {actionText}
        </Button>
      }
    >
      {message}
    </Alert>
  );
};

export default AlertWithAction;
