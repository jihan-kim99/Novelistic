"use client";
import { useState, useEffect } from "react";
import { db } from "../utils/db";
import { uploadNovel } from "../utils/upload";
import { Novel } from "../types/database";
import NovelList from "../components/NovelList";
import { useRouter } from "next/navigation";
import { useAI } from "../contexts/AIContext";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Box,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";

export default function Home() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    apiKey,
    setApiKey,
    imageApiKey,
    setImageApiKey,
    imageEndpoint,
    setImageEndpoint,
  } = useAI();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await db.init();
        const allNovels = await db.getAllNovels();
        setNovels(allNovels);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDB();
  }, []);

  const handleCreateNew = async () => {
    const newNovel: Novel = {
      title: "My Novel",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const id = await db.saveNovel(newNovel);
      router.push(`/novel/${id}`);
    } catch (error) {
      console.error("Failed to create new novel:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this novel?")) return;

    try {
      await db.deleteNovel(id);
      setNovels(novels.filter((novel) => novel.id !== id));
    } catch (error) {
      console.error("Failed to delete novel:", error);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const values = pastedText.split("\n").filter((v) => v.trim());

    if (values[0]) setApiKey(values[0]);
    if (values[1]) setImageApiKey(values[1]);
    if (values[2]) setImageEndpoint(values[2]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    await handleFileUpload(files[0]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadError(null);
      // Extract title from filename by removing the .epub extension
      const title = file.name.replace(/\.epub$/i, "");
      const { novel } = await uploadNovel(file, title);
      setNovels([...novels, novel]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload file"
      );
      console.error("Failed to upload epub:", error);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Novels
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          border: isDragging ? "2px dashed #1976d2" : "2px dashed #ccc",
          backgroundColor: isDragging
            ? "rgba(25, 118, 210, 0.08)"
            : "transparent",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Drop EPUB file here
        </Typography>
        <Box textAlign="center">
          <input
            type="file"
            accept=".epub"
            style={{ display: "none" }}
            id="epub-upload"
            onChange={handleFileSelect}
          />
          <label htmlFor="epub-upload">
            <Button variant="contained" component="span">
              Upload EPUB
            </Button>
          </label>
        </Box>
        {uploadError && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {uploadError}
          </Typography>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          AI Settings
        </Typography>
        <Stack spacing={3}>
          <TextField
            type="password"
            label="Gemini API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onPaste={handlePaste}
            fullWidth
            variant="outlined"
          />
          <TextField
            type="password"
            label="Image Generation API Key"
            value={imageApiKey}
            onChange={(e) => setImageApiKey(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Image Generation Endpoint"
            value={imageEndpoint}
            onChange={(e) => setImageEndpoint(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Stack>
      </Paper>

      <NovelList
        novels={novels}
        onCreateNew={handleCreateNew}
        onDelete={handleDelete}
      />
    </Container>
  );
}
