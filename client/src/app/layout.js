import '@coinbase/onchainkit/styles.css';
import { Ubuntu_Sans_Mono } from "next/font/google";
import Idendity from "./components/identity"
import { Providers } from "./components/providers";
import "./globals.css";
import Navbar from './components/nav';

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
    <html lang="en">
      <body
        className={`${ubuntu.variable}`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
