import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useAccount, useContractRead, useDisconnect } from 'wagmi';

import Button from '@/components/buttons/Button';
import Wallet from '@/components/svg/Wallet';

import en from '@/locale/en';
import es from '@/locale/es';

export default function Header() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { pathname, locale } = useRouter();

  const t = locale === 'es' ? es : en;

  const { data } = useContractRead({
    address: process.env.NEXT_PUBLIC_ERC20,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: [address || ethers.constants.AddressZero],
    enabled: Boolean(address),
  });

  return (
    <header className='sticky top-0 z-50 border-b bg-backgound'>
      <div className='layout flex h-[100px] items-center justify-between'>
        <h1>{pathname.includes('profile') ? t.profile : 'Marketplace'}</h1>
        <nav>
          <ul className='flex items-center justify-between gap-3 '>
            <div className='h-[50px] border-r' />
            <li className='flex items-center gap-3 rounded-lg bg-white p-3'>
              {data ? (
                <>
                  <div className='font-semibold'>
                    ${parseInt(ethers.utils.formatEther(data))}
                  </div>
                </>
              ) : (
                <div className='h-6 w-20 animate-pulse rounded bg-slate-300' />
              )}
              <Wallet />
            </li>
            <div className='h-[50px] border-r' />
            <li>
              <Button onClick={() => disconnect?.()}>{t.disconnect}</Button>
            </li>
            {/* <div className='h-[50px] border-r' /> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
