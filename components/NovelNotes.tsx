import React from "react";
import { Drawer, TextField, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Novel } from "@/types/database";
import { db } from "@/utils/db";

interface NovelNotesProps {
  novel: Novel;
  open: boolean;
  onClose: () => void;
}

export default function NovelNotes({ novel, open, onClose }: NovelNotesProps) {
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
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: "400px" },
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

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Characters"
          defaultValue={novel.notes.characters.join("\n")}
          onChange={(e) => handleNotesChange("characters", e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Settings"
          defaultValue={novel.notes.settings.join("\n")}
          onChange={(e) => handleNotesChange("settings", e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Plot Points"
          defaultValue={novel.notes.plotPoints.join("\n")}
          onChange={(e) => handleNotesChange("plotPoints", e.target.value)}
        />
      </Box>
    </Drawer>
  );
}
