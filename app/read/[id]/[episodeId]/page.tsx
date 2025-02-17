"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../utils/db";
import { Novel, Episode } from "../../../../types/database";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function ReadEpisode() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [prevEpisode, setPrevEpisode] = useState<Episode | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const loadData = async () => {
      if (!params.id || !params.episodeId) return;

      try {
        const [novelData, episodes] = await Promise.all([
          db.getNovel(Number(params.id)),
          db.getNovelEpisodes(Number(params.id)),
        ]);

        if (novelData) {
          setNovel(novelData);
          const currentIndex = episodes.findIndex(
            (ep) => ep.id === Number(params.episodeId)
          );
          setEpisode(episodes[currentIndex]);
          setNextEpisode(episodes[currentIndex + 1] || null);
          setPrevEpisode(episodes[currentIndex - 1] || null);
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

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  if (!novel || !episode) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        bgcolor: isDarkMode ? "background.default" : "background.paper",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 3,
          bgcolor: isDarkMode ? "background.paper" : "background.default",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <ButtonGroup variant="contained" sx={{ mr: 2 }}>
            <Button onClick={decreaseFontSize}>
              <FormatSizeIcon sx={{ fontSize: "1rem" }} />
            </Button>
            <Button onClick={increaseFontSize}>
              <FormatSizeIcon sx={{ fontSize: "1.5rem" }} />
            </Button>
          </ButtonGroup>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>

        <Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
          {episode.title}
        </Typography>
        <Box
          sx={{
            my: 4,
            color: "text.primary",
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: episode.content }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
          }}
        >
          {prevEpisode && (
            <Button
              startIcon={<NavigateBeforeIcon />}
              onClick={() => router.push(`/read/${novel.id}/${prevEpisode.id}`)}
              variant="contained"
            >
              Previous Chapter
            </Button>
          )}
          {nextEpisode && (
            <Button
              endIcon={<NavigateNextIcon />}
              onClick={() => router.push(`/read/${novel.id}/${nextEpisode.id}`)}
              variant="contained"
              sx={{ ml: "auto" }}
            >
              Next Chapter
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
