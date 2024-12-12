'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const LandingPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const getUser = async () => {
    try {
      const response = await fetch(`api/user?address=${address}`);

      const data: { found: boolean; type: string } = await response.json();

      if (data.found && data.type === 'practitioner') {
        router.push('/practitioner');
      } else if (data.found) {
        router.push('/patient');
      } else {
        router.push('/register');
      }
    } catch (err) {
      router.push('/register');
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      void getUser();
    }
  }, [isConnected, address]);

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <ConnectButton />
    </div>
  );
};

export default LandingPage;
