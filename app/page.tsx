"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import EPubViewer from "@/components/molecules/epubViewer";
import Image from "next/image";

const L2i = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const text = event.target.result as string;
            setFileText(text);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Stack direction="row" spacing={1} alignItems="center">
          <Image src="/icon.svg" alt="logo" width={80} height={80} />
          <Typography variant="h2" fontWeight="bold" component="div">
            Novelistic
          </Typography>
        </Stack>
      </Toolbar>
      {fileText ? (
        <EPubViewer
          fileText={fileText}
          setFileText={setFileText}
          setInputText={setInputText}
        />
      ) : (
        <Box padding="0 20px 0 20px" marginBlockEnd="50px">
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              width: "100%",
            }}
          >
            <Typography fontSize={40} fontWeight="bold" mt="50px">
              택본 업로드 (pc 사용을 권장합니다)
            </Typography>
          </Box>
          <Box display="flex" justifyContent="start" alignItems="start">
            <Button
              component="label"
              role={"upload-button"}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{
                borderRadius: 20,
                width: 200,
                marginTop: "50px",
                color: "black",
                borderColor: "black",
              }}
            >
              업로드 버튼
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          <Box width={{ md: "70%", xs: "100%" }} sx={{ mt: "50px" }}>
            <Typography
              fontSize={40}
              fontWeight="bold"
              textAlign="start"
              marginTop="50px"
            >
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
              sx={{ mt: "50px" }}
            />
            <Button
              variant="outlined"
              role="start-button"
              startIcon={<AutoStoriesIcon />}
              style={{
                borderRadius: 20,
                width: 200,
                marginTop: "50px",
                color: "black",
                borderColor: "black",
              }}
              onClick={() => setFileText(inputText)}
            >
              읽기 시작
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default L2i;
