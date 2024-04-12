import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://novelistic.site"),
  title: "노벨리스틱 | 소설 뷰어",
  description: "생동감 넘치는 소설 뷰어",
  openGraph: {
    title: "노벨리스틱 | 소설 뷰어",
    description: "생동감 넘치는 소설 뷰어",
    images: ["icon.png"],
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
