import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';

import Button from '@/components/buttons/Button';
import Drawer from '@/components/layout/Drawer';
import Header from '@/components/layout/Header';
import LogoLarge from '@/components/svg/LogoLarge';

import { polygonChain } from '@/pages/_app';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  const [hasMounted, setHasMounted] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const [_isConnected, setIsConnected] = useState(false);
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  useEffect(() => {
    if (isConnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [isConnected]);

  // Hooks
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render
  if (!hasMounted) return null;

  if (!isConnected) {
    return (
      <div className='flex items-center justify-center'>
        <div className='flex flex-col'>
          <div className='mx-auto mt-[20%]'>
            <LogoLarge />
          </div>
          <h1 className='mt-4 text-center'>Connect Wallet</h1>
          <div className='mt-8 flex flex-wrap gap-2 px-8'>
            {connectors.map((connector) => (
              <Button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (chain?.id !== polygonChain.id)
    return (
      <div className='flex items-center justify-center'>
        <div className='flex flex-col'>
          <div className='mx-auto mt-[20%]'>
            <LogoLarge />
          </div>
          <h1 className='mt-4 text-center'>Connect to Polygon</h1>
          <div className='mx-auto mt-8'>
            <Button onClick={() => switchNetwork?.(polygonChain.id)}>
              Switch Network
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className='layout flex min-h-screen'>
      <Drawer />
      <div className='w-full bg-backgound px-8 pb-8'>
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
}
