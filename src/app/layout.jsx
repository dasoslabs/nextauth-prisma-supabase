import "./globals.css";

export const metadata = {
  title: "Next.js + supabase + prisma + next-auth",
  description: "Generated by Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
