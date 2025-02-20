"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

import { downloadNovel } from "@/utils/download";
import { db } from "@/utils/db";
import { Novel, Episode } from "@/types/database";

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
  const [deleteEpisodeId, setDeleteEpisodeId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

    if (typeof window !== "undefined") {
      db.init()
        .then(() => loadNovelData())
        .catch((error) => {
          console.error("Failed to initialize DB:", error);
          router.push("/");
        })
        .finally(() => setIsLoading(false));
    }
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

  const handleDeleteEpisode = async () => {
    if (!deleteEpisodeId) return;

    try {
      await db.deleteEpisode(deleteEpisodeId);
      // Refresh episodes list
      const updatedEpisodes = await db.getNovelEpisodes(novel!.id!);
      setEpisodes(updatedEpisodes);
      setIsDeleteDialogOpen(false);
      setDeleteEpisodeId(null);
    } catch (error) {
      console.error("Failed to delete episode:", error);
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

  if (isLoading) return <div>Loading...</div>;

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
              <IconButton
                onClick={handleDownload}
                disabled={!episodes.length || isDownloading}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={() => setIsNewEpisodeDialogOpen(true)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          <List>
            {episodes.map((episode) => (
              <ListItem
                key={episode.id}
                component="div"
                sx={{ cursor: "pointer" }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!episode.id) return;
                      setDeleteEpisodeId(episode.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                onClick={() => router.push(`/novel/${novel.id}/${episode.id}`)}
              >
                <ListItemText
                  primary={episode.title}
                  secondary={`Last updated: ${episode.updatedAt.toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>

          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setDeleteEpisodeId(null);
            }}
          >
            <DialogTitle>Delete Episode</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this episode? This action cannot
                be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeleteEpisodeId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteEpisode} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
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
