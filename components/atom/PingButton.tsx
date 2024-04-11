'use client'

import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const PingButton = ({ handlePing }: { handlePing: () => void }) => {
  return (
    <Button
      component="label"
      role={"button"}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      style={{ borderRadius: 20 }}
      onClick={handlePing}
    >
      Upload file
    </Button>
  );
};

export default PingButton;
