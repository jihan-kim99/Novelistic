import type { CSSProperties } from 'react';

interface CustomTypeText {
  bold: string;
  headbar: string;
  placeholder: string;
  landingBtn: string;
  logoText: string;
}

interface CustomTypeBorder {
  tableCell: string;
  tableRow: string;
}

interface CustomTypeBackground {
  headbar: string;
  menubar: string;
  sidebar: string;
  landing: string;
  main: string;
  box: string;
  select: string;
  comment: string;
  tab: string;
  tableHead: string;
}
interface CustomTheme {
  // transparent: string;
}

interface CustomColorPalette {
  primary: string;
  surfaceTint: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
}

declare module '@mui/material/styles' {
  export interface Theme extends CustomTheme {}
  export interface ThemeOptions extends CustomTheme {}
  export interface TypeText extends CustomTypeText {}
  export interface TypeBackground extends CustomTypeBackground {}
  export interface Palette {
    border: CustomTypeBorder;
    material: CustomColorPalette;
  }
  export interface TypographyVariants {
    chip: CSSProperties;
  }
  export interface TypographyVariantsOptions {
    chip?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  export interface TypographyPropsVariantOverrides {
    chip: true;

    subtitle1: false;
    subtitle2: false;
    button: false;
  }
}