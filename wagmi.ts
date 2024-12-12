import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'GaiaHackathonApp',
  projectId: '92668f549afe0667d23f664820809418',
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;
