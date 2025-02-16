"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../util/db";
import { Novel } from "../../../types/database";
import TextEditor from "@/components/TextEditor";
import TopBar from "@/components/TopBar";
import { TextField, Paper, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SendIcon from "@mui/icons-material/Send";
import { useAI } from "../../../contexts/AIContext";
import SettingsIcon from "@mui/icons-material/Settings";
import AISettingsDialog from "@/components/AISettingsDialog";

export default function EditNovel() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState({
    characters: [] as string[],
    settings: [] as string[],
    plotPoints: [] as string[],
    style: "",
  });
  const [aiCommand, setAiCommand] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { generate } = useAI();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const loadNovel = async () => {
      if (!params.id) return;

      try {
        const novelData = await db.getNovel(Number(params.id));
        if (novelData) {
          setNovel(novelData);
          setContent(novelData.content);
          setTitle(novelData.title);
          setNotes(
            novelData.notes || {
              characters: [],
              settings: [],
              plotPoints: [],
              style: "",
            }
          );
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load novel:", error);
        router.push("/");
      }
    };

    loadNovel();
  }, [params.id, router]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!novel) return;
    setIsSaving(true);

    const updatedNovel: Novel = {
      ...novel,
      title,
      content,
      notes,
      updatedAt: new Date(),
    };

    try {
      await db.saveNovel(updatedNovel);
      setNovel(updatedNovel);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save novel:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiCommand.trim()) return;
    setIsGenerating(true);

    try {
      const response = await generate(aiCommand, {
        content,
      });

      setContent(content + response);
      setAiCommand(""); // Clear the input after successful generation
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add auto-save for notes changes
  const handleNotesChange = (
    field: "characters" | "settings" | "plotPoints" | "style",
    value: string | string[]
  ) => {
    const updatedNotes = {
      ...notes,
      [field]: value,
    };
    setNotes(updatedNotes);
    // Trigger save after notes update
    if (novel) {
      const updatedNovel: Novel = {
        ...novel,
        notes: updatedNotes,
        updatedAt: new Date(),
      };
      db.saveNovel(updatedNovel)
        .then(() => setLastSaved(new Date()))
        .catch((error) => console.error("Failed to save notes:", error));
    }
  };

  if (!novel) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        title={title}
        onTitleChange={setTitle}
        onSave={handleSave}
        onBack={() => router.push("/")}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
      <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden" }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextEditor
              initialContent={content}
              onChange={handleContentChange}
              onSave={handleSave}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: "100%", overflow: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Story Notes</Typography>
                <Button
                  startIcon={<SettingsIcon />}
                  onClick={() => setIsSettingsOpen(true)}
                >
                  AI Settings
                </Button>
              </Box>
              <TextField
                label="Characters"
                multiline
                rows={3}
                fullWidth
                value={notes.characters.join("\n")}
                onChange={(e) =>
                  handleNotesChange("characters", e.target.value.split("\n"))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Settings"
                multiline
                rows={3}
                fullWidth
                value={notes.settings.join("\n")}
                onChange={(e) =>
                  handleNotesChange("settings", e.target.value.split("\n"))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Plot Points"
                multiline
                rows={3}
                fullWidth
                value={notes.plotPoints.join("\n")}
                onChange={(e) =>
                  handleNotesChange("plotPoints", e.target.value.split("\n"))
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Writing Style"
                multiline
                rows={2}
                fullWidth
                value={notes.style}
                onChange={(e) => handleNotesChange("style", e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                AI Assistant
              </Typography>
              <TextField
                label="Enter your writing prompt"
                multiline
                rows={3}
                fullWidth
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleAiGenerate}
                disabled={isGenerating}
                fullWidth
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {/* <Box>{content}</Box> */}
      <AISettingsDialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
