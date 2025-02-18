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
  AppBar,
  Toolbar,
} from "@mui/material";
import { useTheme } from "../../../contexts/ThemeContext";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ReadNovel() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  const [novel, setNovel] = useState<Novel | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
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

  if (isLoading) return <div>Loading...</div>;

  if (!novel) return <div>Loading...</div>;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="static" color="default">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push(`/`)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {novel?.title}
          </Typography>
          <List>
            {episodes.map((episode) => (
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
                  primary={`${episode.title}`}
                  sx={{ color: "text.primary" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
