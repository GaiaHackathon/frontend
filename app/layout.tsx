// app/layout.tsx
import './globals.css'
import { Toaster } from 'sonner'
import { WagmiClientProvider } from './WagmiClientProvider' // Adjust the import path as necessary

export default function RootLayout({ children }) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className="bg-[url('/bg-white-peach-squares.png')] bg-cover bg-fixed">
          <WagmiClientProvider>
            <div>{children}</div>
          </WagmiClientProvider>
          <Toaster />
        </body>
      </html>
  );
}

