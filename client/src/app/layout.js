import '@coinbase/onchainkit/styles.css';
import { Geist, Geist_Mono } from "next/font/google";
import Idendity from "./components/identity"
import { Providers } from "./components/providers";
import "./globals.css";
import Navbar from './components/nav';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BaseWrite",
  description: "Collaberative Storytelling on web3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
