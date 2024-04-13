import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Lottie from "react-lottie-player";

import loadingJson from "@/components/atom/loading.json";
import TextLayoutMenu from "../atom/textLayoutMenu";

const TxtViewer = ({
  fileText,
  setFileText,
  setInputText,
}: {
  fileText: string;
  setFileText: (text: string) => void;
  setInputText: (text: string) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(-1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [pageInput, setPageInput] = useState<number>(currentPage);
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineSpace, setLineSpace] = useState<number>(1);
  const [isFirstPage, setIsFirstPage] = useState<boolean>(true);

  const fileInLine = fileText.split("\n");
  const pageSize = 100;

  const pageCount = Math.ceil(fileInLine.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageText = fileInLine.slice(startIndex, endIndex);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
    setPageInput(value - 1);
    setImageUrl(null);
    scrollToTop();
  };

  const handleJumpPage = () => {
    setCurrentPage(pageInput);
    setImageUrl(null);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const generateImage = useCallback(async () => {
    try {
      const res = await fetch(
        "https://asia-northeast1-chatbot-32ff4.cloudfunctions.net/novelistic/generateImage",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
          }),
        }
      );
      const data = await res.json();
      isFirstPage
        ? (setImageUrl("/ready.png"), setIsFirstPage(false))
        : setImageUrl(`data:image/png;base64,${data.image}`);
    } catch (error) {
      setImageUrl("/error.png");
    }
  }, [description, isFirstPage]);

  const handleAskAI = useCallback(async () => {
    const prompt = currentPageText.join("\n");
    console.log(currentPageText);
    const res = await fetch("/api/askAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    const data = await res.json();
    const imageDesc = JSON.parse(data.text.message.content);
    if (imageDesc.isImage) {
      setImageUrl(null);
      setDescription(imageDesc.description);
      generateImage();
    }
  }, [currentPageText, generateImage]);

  useEffect(() => {
    handleAskAI();
  }, [currentPage]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const prevPageInput = currentPage;
      if (event.key === "ArrowLeft") {
        setCurrentPage((prevPageInput) => prevPageInput - 1);
        setPageInput((pageInput) => pageInput - 1);
        scrollToTop();
      } else if (event.key === "ArrowRight") {
        setCurrentPage((prevPageInput) => prevPageInput + 1);
        setPageInput((pageInput) => pageInput + 1);
        scrollToTop();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentPage]);

  useEffect(() => {
    if (isFirstPage) {
      handleAskAI();
    }
  }, []);

  return (
    <>
      <Box width="100%" display="flex" justifyContent="flex-end">
        <TextLayoutMenu
          fontSize={fontSize}
          setFontSize={setFontSize}
          lineSpace={lineSpace}
          setLineSpace={setLineSpace}
        />
      </Box>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item lg={6} xs={12} flex={1} marginTop={5} flexWrap="wrap">
          {currentPageText.map((line, index) => (
            <Typography
              key={index}
              marginTop={lineSpace}
              fontSize={fontSize}
              textAlign="start"
            >
              {line}
            </Typography>
          ))}
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <Box
              margin={{ lg: 4, xs: 0 }}
              marginBlockEnd={{ lg: 4, xs: 4 }}
              sx={{
                aspectRatio: "1/1",
                height: "auto",
                position: "relative",
                width: "100%",
              }}
            >
              <Image
                src={imageUrl}
                alt="Generated Image"
                fill
                priority
                style={{ borderRadius: "1rem", objectFit: "cover" }}
              />
            </Box>
          ) : (
            <Lottie
              loop
              animationData={loadingJson}
              play
              style={{ width: 180, height: 180 }}
            />
          )}
        </Grid>
      </Grid>
      <Stack
        spacing={3}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Pagination
          count={pageCount}
          page={currentPage + 1}
          variant="outlined"
          siblingCount={1}
          onChange={handlePageChange}
        />
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          <TextField
            id="jumpPage"
            label="Jump to Page"
            type="number"
            variant="outlined"
            size="small"
            value={pageInput + 1}
            onChange={(e) => setPageInput(parseInt(e.target.value) - 1)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleJumpPage();
              }
            }}
            style={{ width: 200 }}
          />
          <Button
            variant="outlined"
            onClick={handleJumpPage}
            style={{ borderRadius: 20, color: "black", borderColor: "black" }}
          >
            Jump
          </Button>
        </Stack>
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          direction="row"
          useFlexGap
          flexWrap="wrap"
        >
          <Button
            style={{
              borderRadius: 20,
              width: "150px",
              color: "black",
              borderColor: "black",
            }}
            variant="outlined"
            onClick={() => {
              setFileText("");
              setInputText("");
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default TxtViewer;
