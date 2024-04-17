import { TextField, styled } from "@mui/material";

const CssTextField = styled(TextField)({
  "& label": {
    color: "#A0AAB4",
  },
  "& label.Mui-focused": {
    color: "#6F7E8C",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#6F7E8C",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
  "& input": {
    color: "gray",
  },
});

export default CssTextField;
