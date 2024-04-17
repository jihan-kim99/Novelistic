import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { CssBaseline } from '@mui/material';

import { pretendard, pretendardVariable } from '@/styles/font';
import GlobalStyle from '@/styles/GlobalStyle';

export const metadata: Metadata = {
  metadataBase: new URL('https://novelistic.site'),
  title: 'Novelistic | Novel Viewer',
  description: 'A vivid novel viewer',
  openGraph: {
    title: 'Novelistic | Novel Viewer',
    description: 'A vivid novel viewer',
    images: ['icon.svg'],
  },
  icons: [
    {
      rel: 'icon',
      href: 'icon.svg',
      url: 'icon.svg',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendardVariable.className} ${pretendard.className}`}>
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
