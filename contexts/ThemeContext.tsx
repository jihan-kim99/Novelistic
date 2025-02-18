"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00897b",
      light: "#4ebaaa",
      dark: "#005b4f",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.7)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#2c3e50",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#34495e",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#000000",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4ebaaa",
      light: "#81ede0",
      dark: "#00897b",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "#000000",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.9)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#ffffff",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
