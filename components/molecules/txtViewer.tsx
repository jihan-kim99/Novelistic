import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Lottie from "react-lottie-player";

import loadingJson from "@/components/atom/loading.json";
import CssTextField from "@/components/atom/TextField";
import TextLayoutMenu from "@/components/atom/textLayoutMenu";
import { defaultTags } from "@/utils/defaultTags";
import Link from "next/link";

const CssPagination = styled(Pagination)({
  "& .MuiPaginationItem-root": {
    color: "gray",
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    backgroundColor: "black",
    color: "white",
  },
  "& .MuiPaginationItem-page:hover": {
    backgroundColor: "black",
    color: "white",
  },
});

const TxtViewer = ({
  fileText,
  lightMode,
  setFileText,
  setInputText,
  setLightMode,
}: {
  fileText: string;
  lightMode: boolean;
  setFileText: (text: string) => void;
  setInputText: (text: string) => void;
  setLightMode: (mode: boolean) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState<number>(currentPage);
  const [fontSize, setFontSize] = useState<number>(16);
  const [letterSpace, setLetterSpace] = useState<number>(1);
  const [lineHeight, setLineHeight] = useState<number>(2);

  const fileInLine = fileText.split("\n").filter((line) => line.trim() !== "");
  const pageSize = 50;

  const pageCount = Math.ceil(fileInLine.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageText = fileInLine.slice(startIndex, endIndex);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
    setPageInput(value - 1);
    setImageUrl(null);
  };
  const handleJumpPage = () => {
    setCurrentPage(pageInput);
    setImageUrl(null);
  };

  const scrollToTop = useCallback(() => {
    console.log("scrolling to top");
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    console.log("called scrolltotop");
    scrollToTop();
  }, [currentPage, scrollToTop]);

  const generateImage = async (description) => {
    try {
      console.log("gen", description);
      console.log("gen page", currentPage);
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
      console.log(data.image.length);

      if (data.image.length < 10000) {
        throw new Error("Image generation failed");
      }
      currentPage === -1
        ? setImageUrl("/ready.png")
        : setImageUrl(`data:image/png;base64,${data.image}`);
    } catch (error) {
      if (currentPage === -1) {
        setImageUrl("/ready.png");
        return;
      }
      setImageUrl("/error.png");
    }
  };

  const handleAskAI = useCallback(async () => {
    const prompt = currentPageText.join("\n").replace(/[{}]/g, "");
    console.log(currentPage);
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
      const tags = [...defaultTags].join(", ") + ", " + imageDesc.description;
      generateImage(tags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    console.log("askAI from useEffect");
    handleAskAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentPage((prevPageInput) => prevPageInput - 1);
        setPageInput((pageInput) => pageInput - 1);
      } else if (event.key === "ArrowRight") {
        setCurrentPage((prevPageInput) => prevPageInput + 1);
        setPageInput((pageInput) => pageInput + 1);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentPage]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="flex-end"
        minHeight="100%"
        width="100%"
      >
        <TextLayoutMenu
          fontSize={fontSize}
          letterSpace={letterSpace}
          lineHeight={lineHeight}
          lightMode={lightMode}
          setFontSize={setFontSize}
          setLightMode={setLightMode}
          setLetterSpace={setLetterSpace}
          setLineHeight={setLineHeight}
        />
      </Box>
      <Grid container justifyContent="center" alignItems="center">
        <Grid
          item
          lg={6}
          xs={12}
          flex={1}
          flexWrap="wrap"
          marginBottom={5}
          marginTop={5}
        >
          {currentPageText.map((line, index) => (
            <Typography
              fontSize={fontSize}
              key={index}
              lineHeight={lineHeight}
              letterSpacing={letterSpace}
              textAlign="start"
              marginTop={1}
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
            alignItems: "center",
            display: "flex",
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
                borderRadius: "1rem",
              }}
            >
              <Image
                alt="Generated Image"
                fill
                priority
                src={imageUrl}
                style={{ borderRadius: "1rem", objectFit: "cover" }}
              />
            </Box>
          ) : (
            <Lottie
              animationData={loadingJson}
              loop
              play
              style={{ width: 180, height: 180 }}
            />
          )}
        </Grid>
      </Grid>
      <Stack
        alignItems="center"
        direction="column"
        justifyContent="center"
        spacing={3}
      >
        <CssPagination
          color="primary"
          count={pageCount}
          onChange={handlePageChange}
          page={currentPage + 1}
          siblingCount={1}
          variant="outlined"
        />
        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={{ xs: 1, sm: 2 }}
          useFlexGap
        >
          <CssTextField
            id="jumpPage"
            label="Jump to Page"
            size="small"
            type="number"
            value={pageInput + 1}
            variant="outlined"
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
            style={{
              borderColor: lightMode ? "black" : "white",
              borderRadius: 20,
              color: lightMode ? "black" : "white",
            }}
          >
            Jump
          </Button>
        </Stack>
        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={{ xs: 1, sm: 2 }}
          useFlexGap
        >
          <Link href="/">
            <Button
              style={{
                borderColor: lightMode ? "black" : "white",
                borderRadius: 20,
                color: lightMode ? "black" : "white",
                marginBottom: "20px",
                width: "150px",
              }}
              variant="outlined"
            >
              Go Back
            </Button>
          </Link>
        </Stack>
      </Stack>
    </>
  );
};

export default TxtViewer;
