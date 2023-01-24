import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useContractRead, useContractReads } from 'wagmi';

import EmptyHomeCard from '@/components/homepage/EmptyHomeCard';
import EmptyUpcomingCard from '@/components/homepage/EmptyUpcomingCard';
import HomeCard from '@/components/homepage/HomeCard';
import NotifyCard from '@/components/homepage/NotifyCard';
import UpcomingCard from '@/components/homepage/UpcomingCard';
import Spinner from '@/components/Spinner';

import en from '@/locale/en';
import es from '@/locale/es';

export default function HomePage() {
  const [queueIds, setQueueIds] = useState<BigNumber[]>([]);
  const [queue, setQueue] = useState<Metadata[]>([]);

  const [currentItemId, setCurrentItemId] = useState<BigNumber>();
  const [currentItemMetadata, setCurrentItemMetadata] = useState<Metadata>();

  const [maxSupply, setMaxSupply] = useState<BigNumber>();
  const [currentSupply, setCurrentSupply] = useState<BigNumber>();

  const { locale } = useRouter();

  const t = locale === 'es' ? es : en;

  // ===== CURRENT ITEM ID =====
  useContractRead({
    address: process.env.NEXT_PUBLIC_ERC1155,
    abi: [
      {
        inputs: [],
        name: 'currentItem',
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
    functionName: 'currentItem',
    onSuccess(data) {
      setCurrentItemId(data);
    },
  });

  // ===== CURRENT ITEM METADATA =====
  useContractRead({
    address: process.env.NEXT_PUBLIC_ERC1155,
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'uri',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'uri',
    args: [currentItemId || BigNumber.from(0)],
    enabled: Boolean(currentItemId),
    onSuccess(data) {
      try {
        const json: Metadata = JSON.parse(atob(data.split(',')[1]));
        setCurrentItemMetadata(json);
      } catch (error) {
        /* empty */
      }
    },
  });

  // ===== MAX SUPPLY AND CURRENT SUPPLY =====
  useContractReads({
    contracts: [
      {
        address: process.env.NEXT_PUBLIC_ERC1155,
        abi: [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            name: 'maxSupply',
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
        args: [currentItemId || BigNumber.from(0)],
        functionName: 'maxSupply',
      },
      {
        address: process.env.NEXT_PUBLIC_ERC1155,
        abi: [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
              },
            ],
            name: 'totalSupply',
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
        args: [currentItemId || BigNumber.from(0)],
        functionName: 'totalSupply',
      },
    ],
    enabled: Boolean(currentItemId),
    onSuccess(data) {
      setMaxSupply(data[0]);
      setCurrentSupply(data[1]);
    },
  });

  // ===== QUEUE IDS =====
  useContractRead({
    address: process.env.NEXT_PUBLIC_ERC1155,
    abi: [
      {
        inputs: [],
        name: 'getQueue',
        outputs: [
          {
            internalType: 'uint256[]',
            name: '',
            type: 'uint256[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'getQueue',
    onSuccess(data) {
      setQueueIds([...data]);
    },
  });

  // ===== QUEUE METADATA =====
  useContractReads({
    contracts: queueIds.map((it) => ({
      address: process.env.NEXT_PUBLIC_ERC1155,
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'tokenId',
              type: 'uint256',
            },
          ],
          name: 'uri',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'uri',
      args: [it],
    })),
    enabled: queueIds.length > 0,
    onSuccess(data: unknown[]) {
      const base64s = [...data] as string[];
      const jsons: Metadata[] = [];

      for (let i = 0; i < base64s.length; i++) {
        const json: Metadata = JSON.parse(atob(base64s[i].split(',')[1]));
        jsons.push(json);
      }
      setQueue(jsons);
    },
  });

  if (!currentItemId)
    return (
      <div className='mt-8 flex items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <>
      <main>
        <section className='my-3'>
          {currentItemMetadata ? (
            <HomeCard
              name={currentItemMetadata.name}
              description={decodeURIComponent(
                escape(
                  locale === 'es'
                    ? currentItemMetadata.description_es
                    : currentItemMetadata.description
                )
              )}
              img={currentItemMetadata.image}
              soldTokens={currentSupply?.toNumber() || 0}
              totalTokens={maxSupply?.toNumber() || 0}
              roi={`${
                currentItemMetadata.attributes.find(
                  (it) => it.trait_type === 'ROI per year'
                )?.value
              }`}
              id={currentItemId?.toNumber() || 0}
              rent={`${
                currentItemMetadata.attributes.find(
                  (it) => it.trait_type === 'Estimated rent per night'
                )?.value
              }`}
            />
          ) : (
            <EmptyHomeCard />
          )}
          <div className='mt-8 grid grid-cols-3 gap-3 xl:grid-cols-4'>
            <div className='col-span-3 rounded-lg bg-lightgrey p-8'>
              <div className='mb-8 text-xl font-bold'>{t.upcomingListings}</div>
              <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                {queue.length === 0 && <EmptyUpcomingCard />}
                {queue.map((listing, i) => (
                  <UpcomingCard
                    id={listing.id}
                    key={i}
                    roi={`${
                      listing.attributes.find(
                        (it) => it.trait_type === 'ROI per year'
                      )?.value
                    }`}
                    name={listing.name}
                    img={listing.image}
                  />
                ))}
              </div>
            </div>
            <div className='col-span-full xl:col-span-1'>
              <NotifyCard />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export type Metadata = {
  id: number;
  description: string;
  description_es: string;
  external_url: string;
  image: string;
  images: string[];
  name: string;
  attributes: [
    {
      trait_type: 'Total';
      value: string;
    },
    {
      trait_type: 'Location';
      value: string;
    },
    {
      trait_type: 'ROI per year';
      value: string;
    },
    {
      trait_type: 'ROI from sale';
      value: string;
    },
    {
      trait_type: 'Estimated Net ROI in 5 years';
      value: string;
    },
    {
      trait_type: 'Estimated rent per night';
      value: string;
    },
    {
      trait_type: 'Construction time';
      value: string;
    },
    {
      trait_type: 'Construction cost';
      value: string;
    },
    {
      trait_type: 'Valuation of construction at completion';
      value: string;
    },
    {
      trait_type: 'Valuation of construction in 5 years';
      value: string;
    },
    {
      trait_type: 'Stipulated rental period before sale';
      value: string;
    }
  ];
};
