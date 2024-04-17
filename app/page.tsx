'use client';

import { useState } from 'react';
import { Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DetectFileEncodingAndLanguage from 'detect-file-encoding-and-language';

import CssTextField from '@/components/atom/TextField';
import TxtViewer from '@/components/molecules/txtViewer';
import Image from 'next/image';
import SampleFiles from '@/components/atom/SampleFiles';

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
        bgcolor: lightMode ? 'white' : 'black',
        color: lightMode ? 'black' : 'white',
        flexGrow: 1,
      }}
    >
      <Toolbar>
        <Stack alignItems="center" direction="row" justifyContent="start" spacing={0}>
          <IconButton
            onClick={() => setFileText('')}
            style={{ backgroundColor: 'white', width: '80px', height: '80px' }}
          >
            <Image alt="logo" fill src="/icon.svg" style={{ objectFit: 'fill' }} />
          </IconButton>
          <Typography component="div" fontSize={{ lg: '64px', xs: '36px' }} fontWeight="bold">
            Novelistic
          </Typography>
        </Stack>
      </Toolbar>
      {fileText ? (
        <Box margin="20px">
          <TxtViewer
            fileText={fileText}
            lightMode={lightMode}
            setFileText={setFileText}
            setInputText={setInputText}
            setLightMode={setLightMode}
          />
        </Box>
      ) : (
        <Box padding="0 20px 0 20px" marginBlockEnd="50px">
          <Box
            sx={{
              alignItems: 'start',
              display: 'flex',
              justifyContent: 'start',
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
              startIcon={<CloudUploadIcon />}
              tabIndex={-1}
              variant="outlined"
              style={{
                borderColor: lightMode ? 'black' : 'white',
                borderRadius: 20,
                color: lightMode ? 'black' : 'white',
                marginTop: '50px',
                width: 200,
              }}
            >
              업로드 버튼
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          <SampleFiles handleExapleFiles={handleExapleFiles} />
          <Box width={{ md: '70%', xs: '100%' }} sx={{ mt: '50px' }}>
            <Typography fontSize={{ lg: '48px', xs: '24px' }} fontWeight="bold" marginTop="50px" textAlign="start">
              소설 텍스트로 시작
            </Typography>
            <CssTextField
              fullWidth
              multiline
              onChange={(e) => setInputText(e.target.value)}
              placeholder="소설 본문을 입력해 주세요."
              rows={10}
              sx={{ mt: '50px' }}
              value={inputText}
              variant="outlined"
            />
            <Button
              role="start-button"
              startIcon={<AutoStoriesIcon />}
              variant="outlined"
              style={{
                borderColor: lightMode ? 'black' : 'white',
                borderRadius: 20,
                color: lightMode ? 'black' : 'white',
                marginTop: '50px',
                width: 200,
              }}
              onClick={() => setFileText(inputText)}
            >
              읽기 시작
            </Button>
          </Box>
          <Typography color="gray" fontSize="12px" marginTop="50px" textAlign="center">
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
