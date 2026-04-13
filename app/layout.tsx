import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "In-Hand Helper Calculator",
  description: "Mobile-first salary structure calculator for old vs new labour law projections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const savedTheme = localStorage.getItem("theme");
                const theme = savedTheme === "dark" ? "dark" : "light";
                document.documentElement.classList.toggle("dark", theme === "dark");
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
