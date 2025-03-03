import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./globals.css";

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
        <div className='bg-black text-white justify-center items-center flex py-[10px] px-[400px]'>
          <div className='flex gap-[10px] justify-between w-full'>
            <p className='font-bold' style={{ fontFamily: `'c64', sans-serif`}}># BaseWrite</p>
            <ul className='flex gap-[25px]'>
              <li>Mint</li>
              <li>Write</li>
              <li>About</li>
            </ul>
            <button className='font-bold'>Connect Wallet</button>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
