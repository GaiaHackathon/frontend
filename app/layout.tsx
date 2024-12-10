import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gaia Hackathon',
  description: 'Hackathon Project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='bg-gradient-to-r from-blue-600 to-purple-800'>
        {children}
      </body>
    </html>
  );
}
