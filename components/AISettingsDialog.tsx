import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import AISettings from "./AISettings";

interface AISettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AISettingsDialog({
  open,
  onClose,
}: AISettingsDialogProps) {
  const theme = useTheme();

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: theme.palette.background.paper,
          },
        },
      }}
    >
      <DialogTitle>AI Settings</DialogTitle>
      <DialogContent>
        <AISettings />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
