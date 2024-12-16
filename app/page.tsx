'use client';

import { midnightTheme } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import LandingPage from './landingPage';
import config from '@/wagmi';

export default function Home() {
  const queryClient = new QueryClient();

  return (
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={base} theme={midnightTheme()}>
          <LandingPage />
        </RainbowKitProvider>
      </QueryClientProvider>
  );
}
