import { Ubuntu_Sans_Mono } from "next/font/google";
import Idendity from "./components/identity"
import { Providers } from "./components/providers";
import Navbar from './components/nav';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const ubuntu = Ubuntu_Sans_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
})

export const metadata = {
  title: "BaseWrite",
  description: "Collaberative Storytelling on web3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body
        className={`${ubuntu.variable}`}
      >
        <Providers>
          <Toaster />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
