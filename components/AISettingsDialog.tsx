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
  SelectChangeEvent,
} from "@mui/material";
import { useAI } from "../contexts/AIContext";
import { AIModel } from "@/types/ai";

interface AISettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AISettingsDialog({
  open,
  onClose,
}: AISettingsDialogProps) {
  const {
    model,
    setModel,
    apiKey,
    setApiKey,
    imageApiKey,
    setImageApiKey,
    imageEndpoint,
    setImageEndpoint,
  } = useAI();

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
            onChange={(e: SelectChangeEvent<AIModel>) =>
              setModel(e.target.value as AIModel)
            }
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
        <TextField
          margin="dense"
          label="Image Generation API Key"
          type="password"
          fullWidth
          value={imageApiKey}
          onChange={(e) => setImageApiKey(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Image Generation Endpoint"
          type="text"
          fullWidth
          value={imageEndpoint}
          onChange={(e) => setImageEndpoint(e.target.value)}
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
