"use client";

import TxtViewer from "@/components/molecules/txtViewer";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

const Viewer = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  // get the text from the local storage with the key sessionId

  const [fileText, setFileText] = useState<string>(
    localStorage.getItem(sessionId) || ""
  );
  const [lightMode, setLightMode] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");

  return (
    <Box margin="20px">
      <TxtViewer
        fileText={fileText}
        lightMode={lightMode}
        setFileText={setFileText}
        setInputText={setInputText}
        setLightMode={setLightMode}
      />
    </Box>
  );
};

export default Viewer;
