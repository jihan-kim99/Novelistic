"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../utils/db";
import { Novel, Episode } from "../../../../types/database";
import TextEditor from "@/components/TextEditor";
import TopBar from "@/components/TopBar";
import { TextField, Paper, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SendIcon from "@mui/icons-material/Send";
import { useAI } from "../../../../contexts/AIContext";
import ImageIcon from "@mui/icons-material/Image";
import ImgGenDialog from "@/components/ImgGenDialog";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function EditEpisode() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
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
  const [summaryText, setSummaryText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { generate, summary } = useAI();
  const [isImgGenOpen, setIsImgGenOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!params.id || !params.episodeId) return;

      try {
        const [novelData, episodeData] = await Promise.all([
          db.getNovel(Number(params.id)),
          db.getEpisode(Number(params.episodeId)),
        ]);

        if (novelData && episodeData) {
          setNovel(novelData);
          setEpisode(episodeData);
          setContent(episodeData.content);
          setTitle(episodeData.title);
          setNotes(
            episodeData.notes || {
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
        console.error("Failed to load data:", error);
        router.push("/");
      }
    };

    loadData();
  }, [params.id, params.episodeId, router]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!episode) return;
    setIsSaving(true);

    const updatedEpisode: Episode = {
      ...episode,
      title,
      content,
      notes,
      updatedAt: new Date(),
    };

    try {
      await db.saveEpisode(updatedEpisode);
      setEpisode(updatedEpisode);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save episode:", error);
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

  const removeImages = (htmlContent: string) => {
    // Remove img tags using regex
    return htmlContent.replace(/<img[^>]*>/g, "");
  };

  const handleSummaryGenerate = async () => {
    if (!content.trim()) return;
    setIsSummarizing(true);

    try {
      const cleanContent = removeImages(content);
      const result = await summary(cleanContent);
      setSummaryText(result);
    } catch (error) {
      console.error("Summary generation failed:", error);
    } finally {
      setIsSummarizing(false);
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

    // Save notes with episode
    if (episode) {
      const updatedEpisode: Episode = {
        ...episode,
        notes: updatedNotes,
        updatedAt: new Date(),
      };
      db.saveEpisode(updatedEpisode)
        .then(() => {
          setEpisode(updatedEpisode);
          setLastSaved(new Date());
        })
        .catch((error) => console.error("Failed to save notes:", error));
    }
  };

  const handleImageGenerated = (image: string, prompt: string) => {
    setGeneratedImage(image);
    setImagePrompt(prompt);
    // The dialog will stay open since we're not modifying isImgGenOpen here
  };

  const handleInsertImage = () => {
    if (generatedImage) {
      const imageHtml = `<img src="${generatedImage}" alt="${imagePrompt}" />`;
      setContent(content + imageHtml);
      setGeneratedImage(null);
      setImagePrompt("");
    }
  };

  if (!novel || !episode) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        title={title}
        onTitleChange={setTitle}
        onSave={handleSave}
        onBack={() => router.push(`/novel/${novel.id}`)}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
      <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden" }}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "100%",
            justifyContent: {
              xs: "flex-start",
              md: isPanelOpen ? "flex-start" : "center",
            },
          }}
        >
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              transition: "all 0.3s ease",
              maxWidth: {
                xs: "100%",
                md: isPanelOpen ? "60%" : "70%",
              },
              flexBasis: {
                xs: "100%",
                md: isPanelOpen ? "60%" : "70%",
              },
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => setIsImgGenOpen(true)}
                >
                  Generate Image
                </Button>
                {generatedImage && (
                  <Button variant="contained" onClick={handleInsertImage}>
                    Insert Generated Image
                  </Button>
                )}
              </Box>
              <Button
                variant="contained"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                sx={{ minWidth: "40px", width: "40px", p: 1 }}
              >
                {isPanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </Button>
            </Box>
            <TextEditor
              initialContent={content}
              onChange={handleContentChange}
              onSave={handleSave}
            />
          </Grid>
          {isPanelOpen && (
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                maxWidth: {
                  xs: "100%",
                  md: "35%",
                },
                flexBasis: {
                  xs: "100%",
                  md: "35%",
                },
              }}
            >
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
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Summary Generator
                  </Typography>
                  <TextField
                    label="Generated Summary"
                    multiline
                    rows={3}
                    fullWidth
                    value={summaryText}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSummaryGenerate}
                    disabled={isSummarizing}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {isSummarizing
                      ? "Generating Summary..."
                      : "Generate Summary"}
                  </Button>
                </Box>
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
          )}
        </Grid>
      </Box>
      <ImgGenDialog
        open={isImgGenOpen}
        onClose={() => setIsImgGenOpen(false)}
        onImageGenerated={handleImageGenerated}
        generatedImage={generatedImage}
        onInsert={handleInsertImage}
      />
    </div>
  );
}
