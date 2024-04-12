import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "노벨리스틱 | 소설 뷰어",
  description: "생동감 넘치는 소설 뷰어",
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
