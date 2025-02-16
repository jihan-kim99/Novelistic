import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAI } from "../contexts/AIContext";

interface AISettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AISettingsDialog({
  open,
  onClose,
}: AISettingsDialogProps) {
  const { model, setModel, apiKey, setApiKey } = useAI();

  const handleSave = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>AI Settings</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>AI Model</InputLabel>
          <Select
            value={model}
            label="AI Model"
            onChange={(e) => setModel(e.target.value as any)}
          >
            <MenuItem value="gemini">Gemini</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="API Key"
          type="password"
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          sx={{ mt: 2 }}
        />
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
