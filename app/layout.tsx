// app/layout.tsx
import './globals.css'
import { Toaster } from 'sonner'
import { WagmiClientProvider } from './WagmiClientProvider' // Adjust the import path as necessary
import { ReactNode } from 'react'; // Import ReactNode

export default function RootLayout({ children }: { children: ReactNode }) { // Type children as ReactNode
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='bg-gradient-to-r from-blue-600 to-purple-800'>
        <WagmiClientProvider>
          <div>{children}</div>
        </WagmiClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
