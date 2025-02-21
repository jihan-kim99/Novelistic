import React, { useEffect, useState } from "react";
import { Drawer, TextField, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Novel } from "@/types/database";
import { db } from "@/utils/db";

interface NovelNotesProps {
  novel: Novel;
  open: boolean;
  onClose: () => void;
}

export default function NovelNotes({
  novel: initialNovel,
  open,
  onClose,
}: NovelNotesProps) {
  const [novel, setNovel] = useState(initialNovel);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLatestNovel = async () => {
      if (!open) return;

      setIsLoading(true);
      try {
        if (!initialNovel.id) return;
        const latestNovel = await db.getNovel(initialNovel.id);
        if (latestNovel) {
          setNovel(latestNovel);
        }
      } catch (error) {
        console.error("Failed to fetch latest novel:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestNovel();
  }, [initialNovel.id, open]);

  const handleNotesChange = async (
    field: keyof Novel["notes"],
    value: string
  ) => {
    const updatedNovel: Novel = {
      ...novel,
      notes: {
        ...novel.notes,
        [field]: value.split("\n"),
      },
      updatedAt: new Date(),
    };

    await db.saveNovel(updatedNovel);
    setNovel(updatedNovel);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "400px", maxWidth: "100%" },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Novel Notes</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Characters"
              value={novel.notes.characters.join("\n")}
              onChange={(e) => handleNotesChange("characters", e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Settings"
              value={novel.notes.settings.join("\n")}
              onChange={(e) => handleNotesChange("settings", e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Plot Points"
              value={novel.notes.plotPoints.join("\n")}
              onChange={(e) => handleNotesChange("plotPoints", e.target.value)}
            />
          </>
        )}
      </Box>
    </Drawer>
  );
}
