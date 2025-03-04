"use client";

import { useEffect, useState, useRef } from "react";
import { useImageViewer } from "react-image-viewer-hook";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  IconButton,
  ButtonGroup,
  AppBar,
  Toolbar,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";

import { db } from "@/utils/db";
import { useTheme } from "@/contexts/ThemeContext";
import { Novel, Episode } from "@/types/database";

export default function ReadEpisode() {
  const params = useParams();
  const router = useRouter();
  const { getOnClick, ImageViewer } = useImageViewer();
  const { isDarkMode, toggleTheme } = useTheme();

  const [novel, setNovel] = useState<Novel | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [prevEpisode, setPrevEpisode] = useState<Episode | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    if (typeof window !== "undefined") {
      db.init()
        .then(() => loadData())
        .catch((error) => {
          console.error("Failed to initialize DB:", error);
          router.push("/");
        })
        .finally(() => setIsLoading(false));
    }
  }, [params.id, params.episodeId, router]);

  useEffect(() => {
    if (contentRef.current) {
      const images = contentRef.current.getElementsByTagName("img");
      Array.from(images).forEach((img) => {
        img.style.cursor = "pointer";
        img.setAttribute("data-image-url", img.src);
      });
    }
  }, [episode]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "IMG") {
      const imageUrl = target.getAttribute("data-image-url");
      if (imageUrl) {
        getOnClick(imageUrl)(event);
      }
    }
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const increaseLineHeight = () => {
    setLineHeight((prev) => Math.min(prev + 0.2, 3.0));
  };

  const decreaseLineHeight = () => {
    setLineHeight((prev) => Math.max(prev - 0.2, 1.0));
  };

  if (isLoading) return <div>Loading...</div>;

  if (!novel || !episode) return <div>Loading...</div>;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: isDarkMode ? "background.paper" : "background.default",
          transition: "transform 0.3s ease",
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push(`/read/${novel.id}`)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ButtonGroup variant="contained" size="small" sx={{ mr: 2 }}>
              <Button onClick={decreaseFontSize}>
                <FormatSizeIcon sx={{ fontSize: "1rem" }} />
              </Button>
              <Button onClick={increaseFontSize}>
                <FormatSizeIcon sx={{ fontSize: "1.5rem" }} />
              </Button>
            </ButtonGroup>
            <ButtonGroup variant="contained" size="small" sx={{ mr: 2 }}>
              <Button onClick={decreaseLineHeight}>
                <FormatLineSpacingIcon sx={{ fontSize: "1rem" }} />
              </Button>
              <Button onClick={increaseLineHeight}>
                <FormatLineSpacingIcon sx={{ fontSize: "1.5rem" }} />
              </Button>
            </ButtonGroup>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <ImageViewer />
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 3,
          mt: 8,
          bgcolor: isDarkMode ? "background.paper" : "background.default",
        }}
      >
        <Box
          ref={contentRef}
          onClick={handleImageClick}
          sx={{
            color: "text.primary",
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            "& img": {
              maxWidth: "100%",
              height: "auto",
              display: "block",
              margin: "1rem auto",
            },
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
              Back
            </Button>
          )}
          {nextEpisode && (
            <Button
              endIcon={<NavigateNextIcon />}
              onClick={() => router.push(`/read/${novel.id}/${nextEpisode.id}`)}
              variant="contained"
              sx={{ ml: "auto" }}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
