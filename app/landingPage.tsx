'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const LandingPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/register');
    }
  }, [isConnected]);

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <ConnectButton />
    </div>
  );
};

export default LandingPage;
