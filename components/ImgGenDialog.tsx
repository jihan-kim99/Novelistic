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
} from "@mui/material";
import Image from "next/image";
import { useAI } from "../contexts/AIContext";

interface ImgGenDialogProps {
  open: boolean;
  onClose: () => void;
  onImageGenerated: (image: string, prompt: string) => void;
  generatedImage: string | null;
  onInsert: () => void;
}

export default function ImgGenDialog({
  open,
  onClose,
  onImageGenerated,
  generatedImage,
  onInsert,
}: ImgGenDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateImage } = useAI();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const imageUrl = await generateImage(prompt);
      onImageGenerated(imageUrl, prompt);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setPrompt("");
    onClose();
  };

  const handleInsertAndClose = () => {
    onInsert();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: "80vw",
            height: "80vh",
            maxHeight: "80vh",
          },
        },
      }}
    >
      <DialogTitle>Generate Image</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Image Description"
          fullWidth
          multiline
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Box
          sx={{
            mt: 2,
            position: "relative",
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "60vh",
          }}
        >
          {isGenerating ? (
            <CircularProgress />
          ) : (
            generatedImage && (
              <Image
                src={generatedImage}
                alt={prompt}
                fill
                style={{
                  objectFit: "contain",
                }}
                sizes="80vw"
              />
            )
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {generatedImage && (
          <Button onClick={handleInsertAndClose} color="secondary">
            Insert Image
          </Button>
        )}
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
