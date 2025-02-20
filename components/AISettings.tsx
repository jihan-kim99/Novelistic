import { useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useAI } from "@/contexts/AIContext";

const AISettings = () => {
  const theme = useTheme();
  const {
    apiKey,
    setApiKey,
    imageApiKey,
    setImageApiKey,
    imageEndpoint,
    setImageEndpoint,
  } = useAI();

  useEffect(() => {
    // Load values from localStorage
    const storedApiKey = localStorage.getItem("aiApiKey");
    const storedImageApiKey = localStorage.getItem("imageApiKey");
    const storedImageEndpoint = localStorage.getItem("imageEndpoint");

    if (storedApiKey) setApiKey(storedApiKey);
    if (storedImageApiKey) setImageApiKey(storedImageApiKey);
    if (storedImageEndpoint) setImageEndpoint(storedImageEndpoint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const values = pastedText.split("\n").filter((v) => v.trim());

    if (values[0]) {
      setApiKey(values[0]);
      localStorage.setItem("aiApiKey", values[0]);
    }
    if (values[1]) {
      setImageApiKey(values[1]);
      localStorage.setItem("imageApiKey", values[1]);
    }
    if (values[2]) {
      setImageEndpoint(values[2]);
      localStorage.setItem("imageEndpoint", values[2]);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("aiApiKey", value);
  };

  const handleImageApiKeyChange = (value: string) => {
    setImageApiKey(value);
    localStorage.setItem("imageApiKey", value);
  };

  const handleImageEndpointChange = (value: string) => {
    setImageEndpoint(value);
    localStorage.setItem("imageEndpoint", value);
  };

  return (
    <Accordion
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: "none",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">AI Settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <TextField
            type="password"
            label="Gemini API Key"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            onPaste={handlePaste}
            fullWidth
            variant="outlined"
          />
          <TextField
            type="password"
            label="Image Generation API Key"
            value={imageApiKey}
            onChange={(e) => handleImageApiKeyChange(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Image Generation Endpoint"
            value={imageEndpoint}
            onChange={(e) => handleImageEndpointChange(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default AISettings;
