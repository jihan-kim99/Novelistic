"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DetectFileEncodingAndLanguage from "detect-file-encoding-and-language";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

import CssTextField from "@/components/atom/TextField";
import Image from "next/image";
import SampleFiles from "@/components/atom/SampleFiles";
import Link from "next/link";
import createSessionId from "@/utils/createSessionId";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { db } from "@/utils/firebaseConfig";

const L2i = () => {
  const [inputText, setInputText] = useState<string>("");
  const [lightMode, setLightMode] = useState<boolean>(true);
  const [userSessions, setUserSessions] = useState<string[]>([]);
  const sessionId = useRef<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const saveFileText = async (fileText: string) => {
    sessionId.current = createSessionId();

    try {
      await setDoc(doc(db, "sessions", sessionId.current), {
        sessionId: sessionId.current,
        fileText,
        createdAt: new Date(),
        userId: user?.uid,
        currentPage: 0,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        sessions: arrayUnion(sessionId.current),
      });

      router.push(`/${sessionId.current}`);
    } catch (error) {
      console.error("Error saving file text to Firestore:", error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file) {
        if (file.type !== "text/plain") {
          console.error("Invalid file type. Only text files are allowed.");
          return;
        }
        const result = await DetectFileEncodingAndLanguage(file);
        const encoding = result.encoding;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            const text = event.target.result as string;
            saveFileText(text);
          }
        };
        console.log(encoding);
        reader.readAsText(file, encoding);
      }
    }
  };

  const handleExampleFiles = async (fileName: string) => {
    try {
      const response = await fetch(`/sampleTxt/${fileName}`);
      const text = await response.text();
      saveFileText(text);
    } catch (error) {
      console.error("Error loading example file:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserSessions = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log(userSnap.data());
            setUserSessions(userSnap.data().sessions);
          }
        } catch (error) {
          console.error("Error fetching user sessions from Firestore:", error);
        }
      };
      fetchUserSessions();
    }
  }, [user]);

  return (
    <Box
      component="main"
      sx={{
        bgcolor: lightMode ? "white" : "black",
        color: lightMode ? "black" : "white",
        flexGrow: 1,
      }}
    >
      <Toolbar>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="start"
            spacing={0}
          >
            <IconButton
              style={{
                backgroundColor: "white",
                width: "64px",
                height: "64px",
              }}
            >
              <Image
                alt="logo"
                fill
                src="/icon.svg"
                style={{ objectFit: "fill" }}
              />
            </IconButton>
            <Typography
              component="div"
              fontSize={{ lg: "64px", xs: "36px" }}
              fontWeight="bold"
            >
              Novelistic
            </Typography>
          </Stack>
          <Link href="/login" passHref>
            {user ? (
              <Button
                color="inherit"
                sx={{ marginLeft: "auto", marginRight: "20px" }}
              >
                {user.displayName}
              </Button>
            ) : (
              <Button
                color="inherit"
                sx={{ marginLeft: "auto", marginRight: "20px" }}
              >
                Login
              </Button>
            )}
          </Link>
        </Box>
      </Toolbar>
      <Box padding="0 20px 0 20px" marginBlockEnd="50px">
        <Box
          sx={{
            alignItems: "start",
            display: "flex",
            justifyContent: "start",
            width: "100%",
          }}
        >
          <Typography
            fontSize={{ lg: "48px", xs: "24px" }}
            fontWeight="bold"
            mt="50px"
          >
            Upload your txt file
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" alignItems="start">
          <Button
            component="label"
            role={"upload-button"}
            startIcon={<CloudUploadIcon />}
            tabIndex={-1}
            variant="outlined"
            style={{
              borderColor: lightMode ? "black" : "white",
              borderRadius: 20,
              color: lightMode ? "black" : "white",
              marginTop: "50px",
              width: 200,
            }}
          >
            Upload
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        <SampleFiles handleExampleFiles={handleExampleFiles} />
        <Box width={{ md: "70%", xs: "100%" }} sx={{ mt: "50px" }}>
          <Typography
            fontSize={{ lg: "48px", xs: "24px" }}
            fontWeight="bold"
            marginTop="50px"
            textAlign="start"
          >
            start from text
          </Typography>
          <CssTextField
            fullWidth
            multiline
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Input your novel text."
            rows={10}
            sx={{ mt: "50px" }}
            value={inputText}
            variant="outlined"
          />
          <Button
            role="start-button"
            startIcon={<AutoStoriesIcon />}
            variant="outlined"
            style={{
              borderColor: lightMode ? "black" : "white",
              borderRadius: 20,
              color: lightMode ? "black" : "white",
              marginTop: "50px",
              width: 200,
            }}
            onClick={() => saveFileText(inputText)}
          >
            Start Reading
          </Button>
        </Box>
        <Box width={{ md: "70%", xs: "100%" }} sx={{ mt: "50px" }}>
          <Typography
            fontSize={{ lg: "48px", xs: "24px" }}
            fontWeight="bold"
            marginTop="50px"
            textAlign="start"
          >
            start from previous upload
          </Typography>
          <Box>
            {userSessions.map((sessionId) => (
              <Link key={sessionId} href={`/${sessionId}`} passHref>
                <Button
                  color="inherit"
                  sx={{ marginTop: "20px", width: "100%" }}
                  variant="outlined"
                >
                  {sessionId}
                </Button>
              </Link>
            ))}
          </Box>
        </Box>
        <Typography
          color="gray"
          fontSize="12px"
          marginTop="50px"
          textAlign="center"
        >
          © Copyright 2024 Orca AI, Inc.
        </Typography>
        <Typography color="gray" fontSize="12px" textAlign="center">
          대표자: 홍승표 | 사업자등록번호: 143-88-03054 | 이메일:
          spkbk98@gmail.com
        </Typography>
      </Box>
    </Box>
  );
};

export default L2i;
