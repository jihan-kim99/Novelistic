'use client';

import { useState } from 'react';
import { Box, Button, IconButton, Stack, TextField, Toolbar, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DetectFileEncodingAndLanguage from 'detect-file-encoding-and-language';

import TxtViewer from '@/components/molecules/txtViewer';
import Image from 'next/image';

const L2i = () => {
  const [fileText, setFileText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [lightMode, setLightMode] = useState<boolean>(true);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file) {
        if (file.type !== 'text/plain') {
          console.error('Invalid file type. Only text files are allowed.');
          return;
        }
        const result = await DetectFileEncodingAndLanguage(file);
        const encoding = result.encoding;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const text = event.target.result as string;
            setFileText(text);
          }
        };
        console.log(encoding);
        reader.readAsText(file, encoding);
      }
    }
  };

  const handleExapleFiles = async (fileName: string) => {
    try {
      const response = await fetch(`/sampleTxt/${fileName}`);
      const text = await response.text();
      setFileText(text);
    } catch (error) {
      console.error('Error loading example file:', error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: lightMode ? 'white' : 'black',
        color: lightMode ? 'black' : 'white',
      }}
    >
      <Toolbar>
        <Stack direction="row" spacing={0} alignItems="center" justifyContent="start">
          <IconButton
            style={{ backgroundColor: 'white', width: '80px', height: '80px' }}
            onClick={() => setFileText('')}
          >
            <Image src="/icon.svg" alt="logo" fill style={{ objectFit: 'fill' }} />
          </IconButton>
          <Typography fontSize={{ lg: '64px', xs: '36px' }} fontWeight="bold" component="div">
            Novelistic
          </Typography>
        </Stack>
      </Toolbar>
      {fileText ? (
        <Box margin="20px">
          <TxtViewer
            fileText={fileText}
            setFileText={setFileText}
            setInputText={setInputText}
            lightMode={lightMode}
            setLightMode={setLightMode}
          />
        </Box>
      ) : (
        <Box padding="0 20px 0 20px" marginBlockEnd="50px">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'start',
              width: '100%',
            }}
          >
            <Typography fontSize={{ lg: '48px', xs: '24px' }} fontWeight="bold" mt="50px">
              택본 업로드 (pc 사용을 권장합니다)
            </Typography>
          </Box>
          <Box display="flex" justifyContent="start" alignItems="start">
            <Button
              component="label"
              role={'upload-button'}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{
                borderRadius: 20,
                width: 200,
                marginTop: '50px',
                color: 'black',
                borderColor: 'black',
              }}
            >
              업로드 버튼
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'start',
              width: '100%',
              mt: '20px',
            }}
          >
            <Typography>샘플 다운로드: </Typography>
            <a onClick={() => handleExapleFiles('위대한_개츠비.txt')}>
              <Typography
                color="gray"
                sx={{
                  '&:hover': {
                    color: '#236',
                    cursor: 'pointer',
                  },
                }}
              >
                위대한 개츠비.txt
              </Typography>
            </a>
          </Box>
          <Box width={{ md: '70%', xs: '100%' }} sx={{ mt: '50px' }}>
            <Typography fontSize={{ lg: '48px', xs: '24px' }} fontWeight="bold" textAlign="start" marginTop="50px">
              소설 텍스트로 시작
            </Typography>
            <TextField
              value={inputText}
              fullWidth
              variant="outlined"
              placeholder="소설 본문을 입력해 주세요."
              multiline
              rows={10}
              onChange={(e) => setInputText(e.target.value)}
              sx={{ mt: '50px' }}
            />
            <Button
              variant="outlined"
              role="start-button"
              startIcon={<AutoStoriesIcon />}
              style={{
                borderRadius: 20,
                width: 200,
                marginTop: '50px',
                color: 'black',
                borderColor: 'black',
              }}
              onClick={() => setFileText(inputText)}
            >
              읽기 시작
            </Button>
          </Box>
          <Typography color="gray" fontSize="12px" textAlign="center" marginTop="50px">
            © Copyright 2024 Orca AI, Inc.
          </Typography>
          <Typography color="gray" fontSize="12px" textAlign="center">
            대표자: 홍승표 | 사업자등록번호: 143-88-03054 | 이메일: spkbk98@gmail.com
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default L2i;
