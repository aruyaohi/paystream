import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CivicAuthProvider } from "@civic/auth-web3/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayStream",
  description: "Manage Payroll of your organisation using web3 technologies. Transfer crypto currency to employees seamlessly and little to no charge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <CivicAuthProvider>
        {children}
        </CivicAuthProvider>
      </body>
    </html>
  
    );
}
