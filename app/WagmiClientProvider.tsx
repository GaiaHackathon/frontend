// app/WagmiClientProvider.tsx
"use client"; // Add this line at the top

import { useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export function WagmiClientProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const setupConfig = async () => {
      const cfg = getDefaultConfig({
        appName: 'GaiaHackathonApp',
        projectId: '92668f549afe0667d23f664820809418',
        chains: [base],
        ssr: true,
      });
      setConfig(cfg);
    };

    setupConfig();
  }, []);

  if (!config) {
    return null; // or a loading indicator
  }

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
