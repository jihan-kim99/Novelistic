import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SettingsIcon from "@mui/icons-material/Settings";
import AISettingsDialog from "@/components/AISettingsDialog";

import { useTheme } from "@/contexts/ThemeContext";

interface TopBarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onBack: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export default function TopBar({
  title,
  onTitleChange,
  onSave,
  onBack,
  isSaving,
  lastSaved,
}: TopBarProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  const [editableTitle, setEditableTitle] = useState(title);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setEditableTitle(title);
  }, [title]);

  const handleTitleBlur = () => {
    onTitleChange(editableTitle);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <TextField
          value={editableTitle}
          onChange={(e) => setEditableTitle(e.target.value)}
          onBlur={handleTitleBlur}
          variant="standard"
          sx={{ flexGrow: 1 }}
        />
        <IconButton onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={toggleTheme}>
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {lastSaved && (
          <Typography variant="body2" color="text.secondary">
            Last saved: {lastSaved.toLocaleTimeString()}
          </Typography>
        )}
        <IconButton onClick={onSave} disabled={isSaving}>
          <SaveIcon />
        </IconButton>
        <AISettingsDialog
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </Toolbar>
    </AppBar>
  );
}
