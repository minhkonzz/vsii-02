import { Alert, AlertTitle, Slide, Snackbar, type SlideProps } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import useNetworkDetector from '@/hooks/use-network-detector';

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="down" />;
};

export default function OfflineAlert() {
  const isOnline = useNetworkDetector();

  if (isOnline) return null;

  return (
    <Snackbar
      open={!isOnline}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        top: 0,
        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: '100%',
          borderRadius: 0,
        },
      }}
    >
      <Alert
        severity="warning"
        icon={<WifiOffIcon fontSize="inherit" />}
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%',
            textAlign: 'center',
          },
        }}
      >
        <AlertTitle>You're offline. Please check your internet connection</AlertTitle>
      </Alert>
    </Snackbar>
  );
};
