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
import { ChangeEvent, useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [pageInput, setPageInput] = useState<number>(currentPage);
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineSpace, setLineSpace] = useState<number>(1);

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
    handleAskAI();
  };

  const handleJumpPage = () => {
    setCurrentPage(pageInput);
    setImageUrl(null);
    scrollToTop();
    handleAskAI();
  };

  useEffect(() => {
    scrollToTop();
    handleAskAI();
  }, [fileText]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const prevPageInput = currentPage;
      console.log(prevPageInput);
      if (event.key === "ArrowLeft") {
        setCurrentPage((prevPageInput) => prevPageInput - 1);
        setPageInput((pageInput) => pageInput - 1);
        scrollToTop();
        handleAskAI();
      } else if (event.key === "ArrowRight") {
        setCurrentPage((prevPageInput) => prevPageInput + 1);
        setPageInput((pageInput) => pageInput + 1);
        scrollToTop();
        handleAskAI();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAskAI = async () => {
    const res = await fetch("/api/askAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: currentPageText.join("\n"),
      }),
    });
    const data = await res.json();
    const imageDesc = JSON.parse(data.text.message.content);
    if (imageDesc.isImage) {
      setImageUrl(null);
      console.debug(imageDesc.description);
      setDescription(imageDesc.description);
      generateImage();
    }
  };

  const generateImage = async () => {
    console.log("generateImage");
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
      console.log("success fetch");
      const data = await res.json();
      console.log(data.image.length);
      setImageUrl(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.log("failed");
      setImageUrl("/error.png");
    }
  };

  return (
    <>
      <Box width="100%" display='flex' justifyContent='flex-end'>
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
