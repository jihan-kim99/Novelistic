"use client";

import { useState } from "react";
import { Box, Button, Container, TextField, Toolbar, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import EPubViewer from "@/components/molecules/epubViewer";

// const narou = [       
//   <>   

// <Box
// sx={{
//   display: "flex",
//   overflowX: "auto",
//   width: "100%",
//   mt: "50px",
//   justifyContent: "start",
//   alignItems: "start",
// }}
// >
// <Box width={{lg: '50%', xs: '100%'}}>
//   <TextField
//     value={webUrl}
//     fullWidth
//     variant="outlined"
//     placeholder="소설가가 되자 URL 예시: https://ncode.syosetu.com/n******/1/"
//     onChange={(e) => setWebUrl(e.target.value)}
//     sx={{ color : "black" }}
//   />
// </Box>
// </Box>
// <Box
// sx={{
//   display: "flex",
//   justifyContent: "start",
//   alignItems: "start",
// }}
// >
// <Button
//   variant="outlined"
//   style={{ marginTop: "50px", borderRadius: 20, width: 200, color: "black", borderColor: "black" }}
//   onClick={handleWebUrlCrawl}
// >
//   Load
// </Button>
// </Box>
// </>
// ]

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
        <Typography variant="h2" fontWeight='bold' component="div">
          Novelistic
        </Typography>
      </Toolbar>
      {fileText ? (
        <EPubViewer
          fileText={fileText}
          setFileText={setFileText}
        />
      ) : (
        <Box padding="0 20px 0 20px" marginBlockEnd='50px'>
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
         <Box width={{md: '70%', xs:'100%'}} sx={{mt:"50px"}}>
         <Typography
            fontSize={40}
            fontWeight="bold"
            textAlign="start"
            marginTop='50px'
            >
            소설 텍스트로 시작
          </Typography>
          <TextField
            value= {inputText}
            fullWidth
            variant="outlined"
            placeholder="소설 본문을 입력해 주세요."
            multiline
            rows={10}
            maxRows={10}
            onBlur={(e) => setInputText(e.target.value)}
            sx={{ mt: '50px' }}
          />
          <Button
            variant="outlined"
            style={{ borderRadius: 20, width: 200, marginTop: "50px", color: "black", borderColor: "black" }}
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
