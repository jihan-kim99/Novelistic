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
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  setLightMode,
  currentPage,
  setCurrentPage,
}: {
  fileText: string;
  lightMode: boolean;
  setLightMode: (mode: boolean) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState<number>(currentPage);
  const [fontSize, setFontSize] = useState<number>(16);
  const [letterSpace, setLetterSpace] = useState<number>(1);
  const [lineHeight, setLineHeight] = useState<number>(2);
  const [generating, setGenerating] = useState<boolean>(false);

  const fileInLine = fileText.split("\n").filter((line) => line.trim() !== "");
  const pageSize = 10;

  console.log("currentPage", currentPage);

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
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [currentPage, scrollToTop]);

  const generateImage = async (description) => {
    try {
      console.log("gen", description);
      console.log("gen page", currentPage);
      const res = await fetch("/api/imageGen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: description,
        }),
      });
      const data = await res.json();
      console.log(data);
      setImageUrl(data.imageUrl[0]);
    } catch (error) {
      setImageUrl("/error.png");
    } finally {
      setGenerating(false);
    }
  };

  const handleAskAI = useCallback(async () => {
    setGenerating(true);
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
          ) : generating ? (
            <Lottie
              animationData={loadingJson}
              loop
              play
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Button
              onClick={handleAskAI}
              style={{
                borderColor: lightMode ? "black" : "white",
                borderRadius: 20,
                color: lightMode ? "black" : "white",
              }}
              variant="outlined"
            >
              Generate Image
            </Button>
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
