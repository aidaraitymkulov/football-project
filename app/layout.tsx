import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./layout.scss"
import "./globals.css";
import Header from "./components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Football project",
  description: "Football",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body>
    <div className="page-container">
      <div className="background-container">
        <img
          src="/background.png"
          alt="backgroundImage"
          className="background-image"
        />
      </div>
      <div className="overlay-gradient"></div>
      <div className="content-container">
        <Header />
        {children}
      </div>
    </div>
  </body>
    </html>
  );
}
