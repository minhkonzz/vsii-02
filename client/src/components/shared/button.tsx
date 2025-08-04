import { Button as MuiButton, CircularProgress, type ButtonProps as MuiButtonProps } from '@mui/material';
import { forwardRef } from 'react';

type ButtonVariant = 'text' | 'outlined' | 'contained';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export interface ButtonProps extends Omit<MuiButtonProps, 'color' | 'variant' | 'size'> {
  /**
   * The variant to use.
   * @default 'text'
   */
  variant?: ButtonVariant;
  /**
   * The color of the component.
   * @default 'primary'
   */
  color?: ButtonColor;
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button will show a loading indicator.
   * @default false
   */
  loading?: boolean;
  /**
   * The type of the button.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * The URL to link to when the button is clicked.
   */
  href?: string;
  /**
   * The content of the button.
   */
  children: React.ReactNode;
}

/**
 * A customizable button component built with Material-UI.
 * 
 * @component
 * @example
 * ```tsx
 * <Button 
 *   variant="contained" 
 *   color="primary" 
 *   onClick={() => console.log('Clicked!')}
 * >
 *   Click me
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'text',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  children,
  startIcon,
  endIcon,
  ...rest
}, ref) => {
  const isDisabled = disabled || loading;
  const showStartIcon = loading ? <CircularProgress size={16} color="inherit" /> : startIcon;
  
  return (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={isDisabled}
      type={type}
      startIcon={showStartIcon}
      endIcon={endIcon}
      {...rest}
    >
      {loading && !startIcon ? null : children}
    </MuiButton>
  );
});

Button.displayName = 'Button';

export default Button;