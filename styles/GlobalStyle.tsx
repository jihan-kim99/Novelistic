"use client";

import { GlobalStyles } from "@mui/material";

const GlobalStyle = () => (
  <GlobalStyles
    styles={(theme) => ({
      "html, body, #root": {
        MozOsxFontSmoothing: "grayscale",
        WebkitFontSmoothing: "antialiased",
        WebkitTextSizeAdjust: "none",
        background: theme.palette.background.default,
        boxSizing: "border-box",
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        height: "100%",
        lineHeight: "1.8rem",
        margin: 0,
        msOverflowStyle: "none",
        overflow: "scroll",
        padding: 0,
        scrollbarWidth: "none",
        wordBreak: "normal",
      },
      "#__next": {
        height: "100%",
      },
      a: {
        color: "inherit",
        textDecoration: "none",
      },
      "*": {
        boxSizing: "border-box",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      },
      "*::-webkit-scrollbar": {
        display: "none",
      },
    })}
  />
);

export default GlobalStyle;
