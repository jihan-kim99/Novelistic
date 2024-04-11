"use client";

import { useState } from "react";
import { Box, Button, Container, TextField, Toolbar, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import EPubViewer from "@/components/molecules/epubViewer";

const L2i = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [webUrl, setWebUrl] = useState("");
  const [isNarou, setIsNarou] = useState(false);

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
  const handleWebUrlCrawl = () => {
    fetch("/api/crawlNarou", {
      method: "POST",
      body: JSON.stringify({ url: webUrl }),
    })
      .then((res) => res.json())
      .then((res) => {
        setFileText(res.lightText);
        setSubTitle(res.subTitle);
        setIsNarou(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleNextPage = () => {
    let url = new URL(webUrl);
    let pathParts = url.pathname.split("/");
    pathParts[2] = (parseInt(pathParts[2]) + 1).toString();
    let newPath = pathParts.join("/");
    url.pathname = newPath;
    setWebUrl(url.toString());
    handleWebUrlCrawl();
  };

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography variant="h2" fontWeight='bold' component="div" sx={{ flexGrow: 1 }}>
          Novelistic
        </Typography>
      </Toolbar>
      {fileText ? (
        <EPubViewer
          fileText={fileText}
          subTitle={subTitle}
          isNarou={isNarou}
          handleNextPage={handleNextPage}
          setFileText={setFileText}
        />
      ) : (
        <Box paddingLeft="20px">
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              width: "100%",
            }}
          >
            <Typography fontSize={40} fontWeight="bold" mt="50px">
              택본 업로드  (pc 사용을 권장합니다)
            </Typography>
          </Box>
          <Box display="flex" justifyContent="start" alignItems="start">
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              style={{ borderRadius: 20, width: 200, marginTop: "50px", color: "black", borderColor: "black" }}
            >
              업로드 버튼
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>
          <Typography
            fontSize={40}
            fontWeight="bold"
            textAlign="start"
            marginTop={10}
          >
            소설가가 되자 (개발중)
          </Typography>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              width: "100%",
              mt: "50px",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <Box sx={{ width: "70%" }}>
              <TextField
                value={webUrl}
                fullWidth
                variant="outlined"
                placeholder="https://ncode.syosetu.com/n******/1/"
                onChange={(e) => setWebUrl(e.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <Button
              variant="outlined"
              style={{ marginTop: "50px", borderRadius: 20, width: 200, color: "black", borderColor: "black" }}
              onClick={handleWebUrlCrawl}
            >
              Load
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default L2i;
