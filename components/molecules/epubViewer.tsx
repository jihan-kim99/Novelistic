import { Box, Button, Grid, Pagination, Typography } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import Lottie from "react-lottie-player";

import loadingJson from "@/components/atom/loading.json";

const TxtViewer = ({
  fileText,
  isNarou,
  handleNextPage,
  subTitle,
}: {
  fileText: string;
  isNarou: boolean;
  handleNextPage: () => void;
  subTitle: string;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fileInLine = fileText.split("\n");
  const pageSize = 25;

  const pageCount = Math.ceil(fileInLine.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageText = fileInLine.slice(startIndex, endIndex);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
    setImageUrl(null);
    scrollToTop();
    handleAskAI();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    handleAskAI();
    setCurrentPage(0);
    scrollToTop();
    setImageUrl(null);
  }, [fileText]);

  const generateImage = async (description: string) => {
    const urlEncodedDescription = encodeURIComponent(description);
    const eventSource = new EventSource("/api/generateImage?description=" + urlEncodedDescription);

    eventSource.addEventListener('wait', (event) => {
      console.log('wait:', event.data);
    });
    eventSource.addEventListener('image', (event) => {
      // image is coming as base64 encoded string
      const image = event.data;
      setImageUrl(`data:image/jpeg;base64,${image}`);
      eventSource.close();
    });
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
    // const fetchedData = await fetch("/api/generateImage", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     description: description,
    //   }),
    // });

    // if (!fetchedData.ok) {
    //   console.error("Error fetching image:", fetchedData.statusText);
    //   setImageUrl(null);
    //   return;
    // }
    // const { image: base64Image } = await fetchedData.json();
    // setImageUrl(`data:image/jpeg;base64,${base64Image}`);
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
      generateImage(imageDesc.description);
    }
  };

  return (
    <>
      <Typography variant="h4" textAlign="center" paddingTop={5}>
        {subTitle}
      </Typography>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={6} flex={1} flexWrap="wrap">
          {currentPageText.map((line, index) => (
            <Typography
              key={index}
              variant="body1"
              textAlign="start"
              paddingLeft={5}
              paddingTop={2}
            >
              {line}
            </Typography>
          ))}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <Box sx={{ width: "100%", p: "4rem" }}>
              <Image
                src={imageUrl}
                alt="Generated Image"
                width={400}
                height={400}
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={10}
      >
        <Pagination
          count={pageCount}
          page={currentPage + 1}
          siblingCount={5}
          onChange={handlePageChange}
          color="primary"
        />

        <Button
          variant="contained"
          disabled={!isNarou}
          onClick={() => handleNextPage()}
          style={{ marginRight: 10 }}
        >
          Next Episode
        </Button>
      </Box>
    </>
  );
};

export default TxtViewer;
