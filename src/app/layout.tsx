import type { Metadata } from "next";
import { Libre_Baskerville, Bebas_Neue, Sora, Press_Start_2P, VT323, Silkscreen } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-retro",
  subsets: ["latin"],
  weight: ["400"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: ["400"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "VT Entrepreneurship Club",
  description: "The official launchpad for Hokie innovation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tally Form Embed Script */}
        <script async src="https://tally.so/widgets/embed.js"></script>
      </head>
      <body className={`${libreBaskerville.variable} ${bebasNeue.variable} ${sora.variable} ${pressStart2P.variable} ${vt323.variable} ${silkscreen.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
