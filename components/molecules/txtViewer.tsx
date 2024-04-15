import { Box, Button, Grid, Pagination, Stack, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie-player';

import loadingJson from '@/components/atom/loading.json';
import TextLayoutMenu from '../atom/textLayoutMenu';

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
  const [description, setDescription] = useState<string>('');
  const [pageInput, setPageInput] = useState<number>(currentPage);
  const [fontSize, setFontSize] = useState<number>(16);
  const [lineSpace, setLineSpace] = useState<number>(1);

  const fileInLine = fileText.split('\n').filter((line) => line.trim() !== '');
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
    console.log('scrolling to top');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100); // Adjust delay as needed
  }, []);

  useEffect(() => {
    console.log('called scrolltotop');
    scrollToTop();
  }, [currentPage, scrollToTop]);

  const generateImage = useCallback(async () => {
    try {
      console.log('gen', description);
      console.log('gen page', currentPage);
      const res = await fetch('https://asia-northeast1-chatbot-32ff4.cloudfunctions.net/novelistic/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
        }),
      });
      const data = await res.json();
      console.log(data.image.length);

      if (data.image.length < 1000) {
        throw new Error('Image generation failed');
      }
      currentPage === -1 ? setImageUrl('/ready.png') : setImageUrl(`data:image/png;base64,${data.image}`);
    } catch (error) {
      if (currentPage === -1) {
        setImageUrl('/ready.png');
        return;
      }
      setImageUrl('/error.png');
    }
  }, [description]);

  const handleAskAI = useCallback(async () => {
    const prompt = currentPageText.join('\n');
    console.log(currentPage);
    const res = await fetch('/api/askAI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    const data = await res.json();
    const imageDesc = JSON.parse(data.text.message.content);
    if (imageDesc.isImage) {
      setImageUrl(null);
      console.log('AI asked', imageDesc.description);
      setDescription(imageDesc.description);
    }
  }, [currentPage]);

  useEffect(() => {
    console.log('askAI from useEffect');
    handleAskAI();
  }, [currentPage]);

  useEffect(() => {
    console.log('gen from useEffect');
    generateImage();
  }, [description, generateImage]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentPage((prevPageInput) => prevPageInput - 1);
        setPageInput((pageInput) => pageInput - 1);
      } else if (event.key === 'ArrowRight') {
        setCurrentPage((prevPageInput) => prevPageInput + 1);
        setPageInput((pageInput) => pageInput + 1);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentPage]);

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
            <Typography key={index} marginTop={lineSpace} fontSize={fontSize} textAlign="start">
              {line}
            </Typography>
          ))}
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {imageUrl ? (
            <Box
              margin={{ lg: 4, xs: 0 }}
              marginBlockEnd={{ lg: 4, xs: 4 }}
              sx={{
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
            <Lottie loop animationData={loadingJson} play style={{ width: 180, height: 180 }} />
          )}
        </Grid>
      </Grid>
      <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
        <Pagination
          count={pageCount}
          page={currentPage + 1}
          variant="outlined"
          siblingCount={1}
          onChange={handlePageChange}
        />
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          <TextField
            id="jumpPage"
            label="Jump to Page"
            type="number"
            variant="outlined"
            size="small"
            value={pageInput + 1}
            onChange={(e) => setPageInput(parseInt(e.target.value) - 1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleJumpPage();
              }
            }}
            style={{ width: 200 }}
          />
          <Button
            variant="outlined"
            onClick={handleJumpPage}
            style={{ borderRadius: 20, color: 'black', borderColor: 'black' }}
          >
            Jump
          </Button>
        </Stack>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          <Button
            style={{
              borderRadius: 20,
              width: '150px',
              color: 'black',
              borderColor: 'black',
            }}
            variant="outlined"
            onClick={() => {
              setFileText('');
              setInputText('');
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
