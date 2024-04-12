import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { CssBaseline } from '@mui/material';

import { pretendard, pretendardVariable } from '@/styles/font';
import GlobalStyle from '@/styles/GlobalStyle';

export const metadata: Metadata = {
  metadataBase: new URL("https://novelistic.site"),
  title: "노벨리스틱 | 소설 뷰어",
  description: "생동감 넘치는 소설 뷰어",
  openGraph: {
    title: "노벨리스틱 | 소설 뷰어",
    description: "생동감 넘치는 소설 뷰어",
    images: ["icon.svg"],
  },
  icons: [
    {
      rel: "icon",
      href: "icon.svg",
      url: "icon.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko"  className={`${pretendardVariable.className} ${pretendard.className}`}>
      <head />
        <body>
          <CssBaseline />
          <GlobalStyle />
          {children}
          <Analytics />
        </body>
    </html>
  );
}
