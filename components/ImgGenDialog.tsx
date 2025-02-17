import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useAI } from "../contexts/AIContext";

interface ImgGenDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImgGenDialog({ open, onClose }: ImgGenDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { generateImage } = useAI();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt);
      console.log("Generated image:", imageUrl);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPrompt("");
    setGeneratedImage(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Image</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Image Description"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            disabled={loading}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {generatedImage && (
            <Image
              src={generatedImage}
              alt="Generated"
              width={500}
              height={300}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          color="primary"
          disabled={loading || !prompt.trim()}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
