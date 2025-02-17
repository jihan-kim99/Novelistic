"use client";
import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useTheme } from "../../../contexts/ThemeContext";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function ReadNovel() {
  const params = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { isDarkMode, toggleTheme } = useTheme();

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

  if (!novel) return <div>Loading...</div>;

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "text.primary" }}>
            {novel.title}
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <List>
          {episodes.map((episode, index) => (
            <ListItem
              key={episode.id}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => router.push(`/read/${novel.id}/${episode.id}`)}
            >
              <ListItemText
                primary={`Chapter ${index + 1}: ${episode.title}`}
                sx={{ color: "text.primary" }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
