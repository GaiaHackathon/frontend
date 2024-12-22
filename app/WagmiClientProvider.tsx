// app/WagmiClientProvider.tsx
"use client"; // Add this line at the top

import { useEffect, useState } from 'react';
import { ReactNode } from 'react'; // Import ReactNode
import { WagmiProvider, Config } from 'wagmi'; // Import Config type
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export function WagmiClientProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config | null>(null); // Set the type to Config | null
  useEffect(() => {
    const setupConfig = async () => {
      try {
        const cfg = getDefaultConfig({
          appName: 'GaiaHackathonApp',
          projectId: '92668f549afe0667d23f664820809418',
          chains: [base],
          ssr: true,
        });
        setConfig(cfg);
      } catch (error) {
        console.error('Failed to initialize Wagmi config:', error);
        // Consider showing an error UI state
      }
    };

    setupConfig();
  }, []);

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
