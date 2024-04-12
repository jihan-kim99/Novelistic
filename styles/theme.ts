'use client';

import { Roboto } from 'next/font/google';
import { PaletteMode, createTheme } from '@mui/material';

import { pretendard, pretendardVariable } from './font';

const calcRem = (size: number): string => `${size / 16}rem`;

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const primaryPalette = {
  '0': '#000000',
  '5': '#00102D',
  '10': '#001A41',
  '15': '#002455',
  '20': '#002E69',
  '25': '#00397E',
  '30': '#004494',
  '35': '#004FAA',
  '40': '#005AC1',
  '50': '#2B74E2',
  '60': '#4D8EFE',
  '70': '#80AAFF',
  '80': '#ADC6FF',
  '90': '#D8E2FF',
  '95': '#EDF0FF',
  '98': '#F9F9FF',
  '99': '#FEFBFF',
  '100': '#FFFFFF',
};

export const secondaryPalette = {
  '0': '#000000',
  '5': '#041027',
  '10': '#0F1B32',
  '15': '#1A263D',
  '20': '#253048',
  '25': '#303B53',
  '30': '#3B475F',
  '35': '#47526C',
  '40': '#535E78',
  '50': '#6C7792',
  '60': '#8591AD',
  '70': '#A0ABC8',
  '80': '#BBC6E4',
  '90': '#D8E2FF',
  '95': '#EDF0FF',
  '98': '#F9F9FF',
  '99': '#FEFBFF',
  '100': '#FFFFFF',
};

const materialPalette = (mode: PaletteMode) =>
  mode === 'light'
    ? {
        primary: '#445E91',
        surfaceTint: '#445E91',
        onPrimary: '#FFFFFF',
        primaryContainer: '#D8E2FF',
        onPrimaryContainer: '#001A41',
        secondary: '#575E71',
        onSecondary: '#FFFFFF',
        secondaryContainer: '#DBE2F9',
        onSecondaryContainer: '#141B2C',
        tertiary: '#715573',
        onTertiary: '#FFFFFF',
        tertiaryContainer: '#FBD7FC',
        onTertiaryContainer: '#29132D',
        error: '#BA1A1A',
        onError: '#FFFFFF',
        errorContainer: '#FFDAD6',
        onErrorContainer: '#410002',
        background: '#F9F9FF',
        onBackground: '#1A1B20',
        surface: '#F9F9FF',
        onSurface: '#1A1B20',
        surfaceVariant: '#E1E2EC',
        onSurfaceVariant: '#44474F',
        outline: '#74777F',
        outlineVariant: '#C4C6D0',
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: '#2F3036',
        inverseOnSurface: '#F0F0F7',
        inversePrimary: '#ADC6FF',
        primaryFixed: '#D8E2FF',
        onPrimaryFixed: '#001A41',
        primaryFixedDim: '#ADC6FF',
        onPrimaryFixedVariant: '#2B4678',
        secondaryFixed: '#DBE2F9',
        onSecondaryFixed: '#141B2C',
        secondaryFixedDim: '#BFC6DC',
        onSecondaryFixedVariant: '#3F4759',
        tertiaryFixed: '#FBD7FC',
        onTertiaryFixed: '#29132D',
        tertiaryFixedDim: '#DEBCDF',
        onTertiaryFixedVariant: '#583E5B',
        surfaceDim: '#D9D9E0',
        surfaceBright: '#F9F9FF',
        surfaceContainerLowest: '#FFFFFF',
        surfaceContainerLow: '#F3F3FA',
        surfaceContainer: '#EDEDF4',
        surfaceContainerHigh: '#E8E7EE',
        surfaceContainerHighest: '#E2E2E9',
      }
    : {
        primary: '#ADC6FF',
        surfaceTint: '#ADC6FF',
        onPrimary: '#102F60',
        primaryContainer: '#2B4678',
        onPrimaryContainer: '#D8E2FF',
        secondary: '#BFC6DC',
        onSecondary: '#293041',
        secondaryContainer: '#3F4759',
        onSecondaryContainer: '#DBE2F9',
        tertiary: '#DEBCDF',
        onTertiary: '#402843',
        tertiaryContainer: '#583E5B',
        onTertiaryContainer: '#FBD7FC',
        error: '#FFB4AB',
        onError: '#690005',
        errorContainer: '#93000A',
        onErrorContainer: '#FFDAD6',
        background: '#111318',
        onBackground: '#E2E2E9',
        surface: '#111318',
        onSurface: '#E2E2E9',
        surfaceVariant: '#44474F',
        onSurfaceVariant: '#C4C6D0',
        outline: '#8E9099',
        outlineVariant: '#44474F',
        shadow: '#000000',
        scrim: '#000000',
        inverseSurface: '#E2E2E9',
        inverseOnSurface: '#2F3036',
        inversePrimary: '#445E91',
        primaryFixed: '#D8E2FF',
        onPrimaryFixed: '#001A41',
        primaryFixedDim: '#ADC6FF',
        onPrimaryFixedVariant: '#2B4678',
        secondaryFixed: '#DBE2F9',
        onSecondaryFixed: '#141B2C',
        secondaryFixedDim: '#BFC6DC',
        onSecondaryFixedVariant: '#3F4759',
        tertiaryFixed: '#FBD7FC',
        onTertiaryFixed: '#29132D',
        tertiaryFixedDim: '#DEBCDF',
        onTertiaryFixedVariant: '#583E5B',
        surfaceDim: '#111318',
        surfaceBright: '#37393E',
        surfaceContainerLowest: '#0C0E13',
        surfaceContainerLow: '#1A1B20',
        surfaceContainer: '#1E1F25',
        surfaceContainerHigh: '#282A2F',
        surfaceContainerHighest: '#33353A',
      };

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: materialPalette(mode).primary,
      light: materialPalette(mode).primary,
      dark: materialPalette(mode).primary,
      contrastText: materialPalette(mode).onPrimary,
    },
    secondary: {
      main: materialPalette(mode).secondary,
      light: materialPalette(mode).secondary,
      dark: materialPalette(mode).secondary,
      contrastText: materialPalette(mode).onSecondary,
    },
    text: {
      primary: materialPalette(mode).onBackground,
      secondary: materialPalette(mode).onSurface,
      disabled: materialPalette(mode).outline,
      hint: materialPalette(mode).outline,
    },
    background: {
      default: materialPalette(mode).background,
      paper: materialPalette(mode).surface,
    },
    divider: materialPalette(mode).outline,
    material: { ...materialPalette(mode) },
  },
  transparent: 'rgba(255, 255, 255, 0)',
  typography: {
    fontFamily: [
      pretendardVariable.style.fontFamily,
      pretendard.style.fontFamily,
      '-apple-system',
      'BlinkMacSystemFont',
      'system-ui',
      roboto.style.fontFamily,
      '"Helvetica Neue"',
      '"Segoe UI"',
      '"Apple SD Gothic Neo"',
      '"Noto Sans KR"',
      '"Malgun Gothic"',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      'sans-serif',
    ].join(','),
    fontSize: 16,
    h1: {
      fontSize: calcRem(57),
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    h2: {
      fontSize: calcRem(45),
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    h3: {
      fontSize: calcRem(36),
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    h4: {
      fontSize: calcRem(32),
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    h5: {
      fontSize: calcRem(28),
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    h6: {
      fontSize: calcRem(24),
      fontWeight: 400,
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    body1: {
      fontSize: calcRem(16),
      fontWeight: 'normal',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    body2: {
      fontSize: calcRem(14),
      fontWeight: 'normal',
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    subtitle1Bold: {
      fontSize: calcRem(16),
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: 'normal',
    },
    subtitle2Bold: {
      fontSize: calcRem(14),
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: 'normal',
    },
    chip: {
      fontSize: calcRem(13),
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 'normal',
    },
    overline: {
      fontSize: calcRem(12),
      fontWeight: 'normal',
      lineHeight: 1.5,
      letterSpacing: 'normal',
      textTransform: 'none' as const,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          padding: '0 1.5rem',
          fontSize: '.875rem',
          fontWeight: 500,
          lineHeight: 'normal',
        },
        sizeSmall: {
          blockSize: '2rem',
          borderRadius: '1rem',
          minInlineSize: '2rem',
        },
        sizeMedium: {
          blockSize: '2.5rem',
          borderRadius: '1.25rem',
          minInlineSize: '2.5rem',
        },
        sizeLarge: {
          blockSize: '3rem',
          minInlineSize: '3rem',
          borderRadius: '1.5rem',
        },
        contained: {
          color: materialPalette(mode).onPrimary,
          backgroundColor: materialPalette(mode).primary,
          boxShadow: 'none',
          '&:hover, &:active, &:focus': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: materialPalette(mode).outline,
          color: materialPalette(mode).primary,
          border: '0.0625rem solid',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          '&:hover, &:active, &:focus': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          padding: '1rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: materialPalette(mode).surfaceContainerHigh,
          color: materialPalette(mode).onSurface,
          borderRadius: '1.75rem',
          padding: '1.5rem',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.27rem',
          fontWeight: 400,
          lineHeight: 'normal',
          letterSpacing: 'normal',
          padding: 0,
          paddingBottom: '1rem',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: 0,
          paddingTop: '1.5rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          '&::before, &::after': {
            borderColor: materialPalette(mode).outlineVariant,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: materialPalette(mode).surface,
          borderRight: 'none',
          color: materialPalette(mode).onSurface,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '0.5rem 0',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          blockSize: '3rem',
          padding: '0 1rem',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: materialPalette(mode).surfaceContainer,
          color: materialPalette(mode).onSurface,
          maxBlockSize: '50vh',
        },
        list: {
          padding: '0.5rem 0',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          gap: '0.75rem',
          maxWidth: '17.5rem',
          minBlockSize: '3rem',
          minWidth: '7rem',
          padding: '0.75rem',
          svg: {
            color: materialPalette(mode).onSurfaceVariant,
            height: '1.5rem',
            width: '1.5rem',
          },
          MuiSelect: {
            styleOverrides: {
              paper: {
                height: '200px',
              },
            },
          },
          '&:hover': {
            backgroundColor: materialPalette(mode).surfaceContainerHighest,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: materialPalette(mode).surfaceContainerLow,
          color: materialPalette(mode).onSurface,
        },
        outlined: {
          border: `0.0625rem solid ${materialPalette(mode).outlineVariant}`,
          backgroundColor: materialPalette(mode).surface,
          boxShadow: 'none',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: '0.25rem',
          backgroundColor: materialPalette(mode).inverseSurface,
          color: materialPalette(mode).inverseOnSurface,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: materialPalette(mode).onSurfaceVariant,
          display: 'flex',
          inlineSize: 'auto',
          minWidth: 0,
          padding: '0.5rem 0',
          textTransform: 'none' as const,
          '&.Mui-selected': {
            borderBlockEnd: `0.125rem solid ${materialPalette(mode).primary}`,
            color: materialPalette(mode).primary,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: materialPalette(mode).surface,
          borderBlockEnd: `0.0625rem solid ${materialPalette(mode).surfaceVariant}`,
          color: materialPalette(mode).onSurfaceVariant,
          display: 'flex',
          gap: '2rem',
          justifyContent: 'space-around',
          padding: '0 1rem',
          whiteSpace: 'nowrap',
        },
      },
    },
  },
});

const getTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));

export { getTheme };