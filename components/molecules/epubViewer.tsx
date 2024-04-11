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
  const [description, setDescription] = useState<string>("");

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
  
  useEffect(() => {
    scrollToTop();
    handleAskAI();
  }, [fileText])

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
    console.log('generateImage')
    try{
      const res = await fetch("https://asia-northeast1-chatbot-32ff4.cloudfunctions.net/novelistic/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
        }),
      });
      console.log('success fetch')
      const data = await res.json();
      console.log(data.image.length)
      setImageUrl(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.log('failed')
      setImageUrl('/image.png');
    }
  };

  return (
    <>
      <Typography variant="h4" textAlign="center" paddingTop={5}>
        {subTitle}
      </Typography>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item lg={6} xs={12} flex={1} flexWrap="wrap">
          {currentPageText.map((line, index) => (
            <Typography
              key={index}
              variant="body1"
              textAlign="start"
              paddingLeft={5}
              paddingTop={2}
              paddingRight={3}
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
            <Box sx={{
              aspectRatio: '1/1',
              height: 'auto',
              position: 'relative',

              width: '100%',
            }}
            >
              <Image
                src={imageUrl}
                alt="Generated Image"
                fill
                priority
                style={{ borderRadius: '1rem', objectFit: 'cover' }}
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
          style={{ marginRight: 10, borderRadius: 20}}
        >
          Next Episode
        </Button>
      </Box>
    </>
  );
};

export default TxtViewer;
