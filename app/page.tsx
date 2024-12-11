'use client';

import {
  ConnectButton,
  darkTheme,
  midnightTheme,
} from '@rainbow-me/rainbowkit';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useAccount, WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { useRouter } from 'next/router';
import LandingPage from './landingPage';

const config = getDefaultConfig({
  appName: 'GaiaHackathonApp',
  projectId: '92668f549afe0667d23f664820809418',
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={base} theme={midnightTheme()}>
          <LandingPage />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
