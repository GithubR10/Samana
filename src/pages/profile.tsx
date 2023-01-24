import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';
import Spinner from '@/components/Spinner';

import en from '@/locale/en';
import es from '@/locale/es';

const Wallet = () => {
  const [portfolio, setPortfolio] = useState<MoralisMetadata[]>();
  const [samanaNft, setSamanaNft] = useState<MoralisMetadata>();
  const [samanaCount, setSamanaCount] = useState(0);

  const { address } = useAccount();

  const { locale } = useRouter();
  const t = locale === 'es' ? es : en;

  useEffect(() => {
    const fetchNfts = async () => {
      const options = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
        params: {
          chain: 'polygon',
          format: 'decimal',
          normalizeMetadata: 'true',
        },
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        },
      };

      const { data } = await axios.request(options);

      setPortfolio(
        data.result.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (it: any) =>
            it.token_address.toLowerCase() ===
            `${process.env.NEXT_PUBLIC_ERC1155}`.toLowerCase()
        )
      );

      setSamanaNft(
        data.result.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (it: any) =>
            it.token_address.toLowerCase() ===
            `${process.env.NEXT_PUBLIC_ERC721}`.toLowerCase()
        )
      );

      setSamanaCount(
        data.result.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (it: any) =>
            it.token_address.toLowerCase() ===
            `${process.env.NEXT_PUBLIC_ERC721}`.toLowerCase()
        ).length
      );
    };

    fetchNfts();
  }, [address]);

  if (!portfolio)
    return (
      <div className='mt-8 flex items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <div className='mt-8 flex w-full'>
      <div className='grid w-full gap-8 lg:grid-cols-2'>
        <div className='flex h-full flex-col rounded-2xl bg-white p-8'>
          <div className='text-xl font-bold opacity-60'>{t.portfolioSize}</div>
          <div className='mt-6 flex justify-between text-lg lg:mt-auto'>
            <div className='opacity-60'>{t.landInvestments}</div>
            <div>${samanaCount * 350}</div>
          </div>
          <div className='my-2 flex justify-between text-lg'>
            <div className='opacity-60'>{t.propertyInvestments}</div>
            <div>
              $
              {portfolio?.reduce(
                (acc, curr) => acc + parseInt(curr.amount || '0'),
                0
              )}
            </div>
          </div>
          <hr />
          <div className='mt-2 flex justify-between truncate text-4xl font-extrabold tracking-wider xl:text-6xl'>
            <span className='opacity-30'>Total</span>
            <span>
              $
              {portfolio &&
                samanaCount * 350 +
                  portfolio.reduce(
                    (acc, curr) => acc + parseInt(curr.amount || '0'),
                    0
                  )}
            </span>
          </div>
        </div>

        <div className='relative flex h-[420px] overflow-hidden rounded-2xl bg-gradient-to-bl from-green/30 to-green'>
          <Image
            fill
            alt='nft'
            src='/images/SamanaCitizens.jpg'
            style={{ objectFit: 'cover' }}
          />
          <div className='relative z-10 mt-auto flex w-full bg-lightgrey/70 p-8 font-bold'>
            {samanaNft ? (
              <>
                <div className='mr-2 w-full'>
                  <div className='text-2xl'>Samaná Citizens NFT</div>
                  <div className='mt-2'></div>
                  <div className='mt-2 flex items-start justify-between'>
                    <span>
                      {samanaCount} NFT {t.owned}
                    </span>
                    <span className='flex flex-col'>
                      {t.myLand}: {samanaCount * 7}m²
                      <UnstyledLink
                        className='mt-2'
                        href='https://mintsamanacitizens.com'
                      >
                        <Button>{t.buyLand}</Button>
                      </UnstyledLink>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h3>{t.youAreNotAnNFTOwner}</h3>
                <UnstyledLink
                  // className='opacity-60'
                  href='https://mintsamanacitizens.com'
                >
                  <Button>{t.buyLand}</Button>
                </UnstyledLink>
              </div>
            )}
          </div>
        </div>
        {portfolio && (
          <div className='col-span-full rounded-2xl bg-white p-8'>
            <div className='text-xl font-bold'>{t.yourPortfolio}</div>

            <div className='flex max-h-80 flex-col divide-y overflow-y-scroll'>
              {portfolio.map((it, i) => (
                <div
                  key={i}
                  className='flex items-center gap-4 py-4 lg:grid-cols-5'
                >
                  <div className='w-16'>
                    <div className='relative h-16 w-16 overflow-hidden rounded-full border-2 border-green'>
                      {it.normalized_metadata?.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={it.normalized_metadata?.image}
                          className='h-full w-full'
                          alt={it.name || ''}
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  </div>

                  <div className='whitespace-nowrap font-bold'>
                    <div>{it.normalized_metadata?.name}</div>
                  </div>

                  <div className='w-full rounded-lg bg-lightgrey p-4'>
                    <div className='text-xs font-bold uppercase opacity-60'>
                      % {t.owned}
                    </div>
                    <div className='mt-1 font-bold'>
                      {parseInt(
                        (
                          (parseInt(`${it.amount}`) /
                            parseInt(
                              `${
                                it.normalized_metadata?.attributes?.find(
                                  (it) => it.trait_type === 'Total'
                                )?.value
                              }`
                            )) *
                          100
                        ).toString()
                      )}
                    </div>
                  </div>
                  <div className='w-full rounded-lg bg-lightgrey p-4'>
                    <div className='text-xs font-bold uppercase opacity-60'>
                      {t.roiPerYear}
                    </div>
                    <div className='mt-1 font-bold'>
                      {
                        it.normalized_metadata?.attributes?.find(
                          (it) => it.trait_type === 'ROI per year'
                        )?.value
                      }
                    </div>
                  </div>
                  <div className='w-full rounded-lg bg-lightgrey p-4'>
                    <div className='text-xs font-bold opacity-60'>
                      {t.myInvestment}
                    </div>
                    <div className='mt-1 font-bold'>${it.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;

export interface MoralisMetadata {
  token_address?: string;
  token_id?: string;
  amount?: string;
  owner_of?: string;
  token_hash?: string;
  block_number_minted?: string;
  block_number?: string;
  contract_type?: string;
  name?: string;
  symbol?: string;
  token_uri?: string;
  metadata?: string;
  last_token_uri_sync?: Date;
  last_metadata_sync?: Date;
  minter_address?: string;
  normalized_metadata?: NormalizedMetadata;
}

export interface NormalizedMetadata {
  name?: string;
  description?: string;
  animation_url?: string;
  external_link?: string;
  image?: string;
  attributes?: Attribute[];
}

export interface Attribute {
  trait_type?: string;
  value?: string;
  display_type?: string;
  max_value?: string;
  trait_count?: number;
  order?: string;
}
