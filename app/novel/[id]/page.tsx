"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../utils/db";
import { Novel, Episode } from "../../../types/database";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TopBar from "@/components/TopBar";
import AddIcon from "@mui/icons-material/Add";
import { downloadNovel } from "../../../utils/download";

export default function NovelOverview() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isNewEpisodeDialogOpen, setIsNewEpisodeDialogOpen] = useState(false);
  const [newEpisodeTitle, setNewEpisodeTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const loadNovelData = async () => {
      if (!params.id) return;

      try {
        const novelData = await db.getNovel(Number(params.id));
        const episodesData = await db.getNovelEpisodes(Number(params.id));

        if (novelData) {
          setNovel(novelData);
          setEpisodes(episodesData);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load novel:", error);
        router.push("/");
      }
    };

    loadNovelData();
  }, [params.id, router]);

  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      if (!novel) return;

      try {
        setIsSavingTitle(true);
        const updatedNovel = {
          ...novel,
          title: newTitle,
          updatedAt: new Date(),
        };
        await db.saveNovel(updatedNovel);
        setNovel(updatedNovel);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save novel title:", error);
      } finally {
        setIsSavingTitle(false);
      }
    },
    [novel]
  );

  const handleCreateNewEpisode = async () => {
    if (!novel || !newEpisodeTitle.trim()) return;

    const newEpisode: Episode = {
      novelId: novel.id!,
      title: newEpisodeTitle,
      content: "",
      order: episodes.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: {
        characters: [],
        settings: [],
        plotPoints: [],
        style: "",
      },
    };

    try {
      setIsSaving(true);
      const episodeId = await db.saveEpisode(newEpisode);
      const updatedEpisodes = await db.getNovelEpisodes(novel.id!);
      setEpisodes(updatedEpisodes);
      setIsNewEpisodeDialogOpen(false);
      setNewEpisodeTitle("");
      router.push(`/novel/${novel.id}/${episodeId}`);
    } catch (error) {
      console.error("Failed to create episode:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!novel || !episodes.length) return;

    try {
      setIsDownloading(true);
      await downloadNovel(novel, episodes);
    } catch (error) {
      console.error("Failed to download novel:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!novel) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <TopBar
        title={novel.title}
        onTitleChange={handleTitleChange}
        onSave={() => {}}
        onBack={() => router.push("/")}
        lastSaved={lastSaved}
        isSaving={isSavingTitle}
      />

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Episodes</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                disabled={!episodes.length || isDownloading}
                onClick={handleDownload}
              >
                {isDownloading ? "Downloading..." : "Download EPUB"}
              </Button>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => setIsNewEpisodeDialogOpen(true)}
              >
                New Episode
              </Button>
            </Box>
          </Box>

          <List>
            {episodes.map((episode) => (
              <ListItem
                key={episode.id}
                component="div"
                sx={{ cursor: "pointer" }}
                onClick={() => router.push(`/novel/${novel.id}/${episode.id}`)}
              >
                <ListItemText
                  primary={episode.title}
                  secondary={`Last updated: ${episode.updatedAt.toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Dialog
        open={isNewEpisodeDialogOpen}
        onClose={() => setIsNewEpisodeDialogOpen(false)}
      >
        <DialogTitle>Create New Episode</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Episode Title"
            fullWidth
            value={newEpisodeTitle}
            onChange={(e) => setNewEpisodeTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewEpisodeDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewEpisode}
            disabled={!newEpisodeTitle.trim() || isSaving}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
