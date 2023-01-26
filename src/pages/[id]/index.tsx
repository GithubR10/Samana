import { BigNumber, ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Carousel } from 'react-responsive-carousel';
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

import Button from '@/components/buttons/Button';
import ArrowLink from '@/components/links/ArrowLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Progress from '@/components/Progress';
import Spinner from '@/components/Spinner';
import Dividends from '@/components/svg/Dividends';
import LogoLarge from '@/components/svg/LogoLarge';
import Valueation from '@/components/svg/Valueation';

import en from '@/locale/en';
import es from '@/locale/es';
import { Metadata } from '@/pages';

export default function Index() {
  const { query, reload, locale } = useRouter();
  const { address } = useAccount();

  const [metadata, setMetadata] = useState<Metadata>();

  const [maxSupply, setMaxSupply] = useState<BigNumber>();
  const [bought, setBought] = useState<BigNumber>();

  const [tokenAmount, setTokenAmount] = useState<BigNumber>(BigNumber.from(1));

  const [id, setId] = useState(BigNumber.from(0));

  const [error, setError] = useState(false);

  const t = locale === 'es' ? es : en;

  useEffect(() => {
    if (typeof query.id !== 'undefined') {
      try {
        setId(BigNumber.from(query.id));
      } catch (error) {
        setError(true);
      }
    }
  }, [query.id]);

  // ===== MINT 1155 =====
  const { config: configMint } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_ERC1155,
    abi: [
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'buy',
    args: [id, tokenAmount],
  });

  const { write: writeMint, data: dataMint } = useContractWrite(configMint);

  const { isLoading: isLoadingMint } = useWaitForTransaction({
    hash: dataMint?.hash,
    onSettled() {
      reload();
    },
  });

  // ===== CHECK APPROVED =====
  const { data: allowance } = useContractRead({
    address: process.env.NEXT_PUBLIC_ERC20,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
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
    functionName: 'allowance',
    args: [
      address || ethers.constants.AddressZero,
      process.env.NEXT_PUBLIC_ERC1155 as `0x${string}`,
    ],
    enabled: Boolean(address),
  });

  // ===== APPROVE =====
  const { config: allowanceConfig } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_ERC20,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'approve',
    args: [
      process.env.NEXT_PUBLIC_ERC1155 as `0x${string}`,
      ethers.constants.MaxUint256.sub(1),
    ],
  });

  const { write: writeAllowance, data: dataAllowance } =
    useContractWrite(allowanceConfig);

  const { isLoading: isLoadingAllowance } = useWaitForTransaction({
    hash: dataAllowance?.hash,
    onSettled() {
      reload();
    },
  });

  // ===== CHECK NFT BALANCE =====

  const { data: balance } = useContractRead({
    address: process.env.NEXT_PUBLIC_ERC721,
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
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
    args: [id],
    onSuccess(data) {
      try {
        const json: Metadata = JSON.parse(atob(data.split(',')[1]));
        setMetadata(json);
      } catch (error) {
        setError(true);
      }
    },
  });

  // ===== CURRENT ITEM METADATA =====
  const { data: isActive } = useContractRead({
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
        name: 'active',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'active',
    args: [id],
  });

  // ===== MAX SUPPLY AND CURRENT SUPLLY =====
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
        args: [id],
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
        args: [id],
        functionName: 'totalSupply',
      },
    ],
    onSuccess(data) {
      setMaxSupply(data[0]);
      setBought(data[1]);
    },
  });

  if (error)
    return (
      <section>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <h1 className='mt-8 text-4xl md:text-6xl'>{t.notFound}</h1>
          <ArrowLink className='mt-4 md:text-lg' href='/'>
            {t.backHome}
          </ArrowLink>
        </div>
      </section>
    );

  if (!metadata)
    return (
      <div className='mt-8 flex items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <div className='mt-6 grid grid-cols-12 gap-8'>
      <div className='col-span-full lg:col-span-7'>
        <div className='relative h-96 overflow-hidden rounded-lg bg-white lg:h-full'>
          <Carousel>
            {[metadata.image, ...metadata.images].map((it, i) => (
              <div key={i} className=''>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={i} src={it} alt={`Image ${i}`} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className='col-span-full lg:col-span-5'>
        <div className='rounded-lg bg-white p-8'>
          {/* <div className='font-bold'>Statistics</div> */}
          <div className='text-xs font-bold opacity-60'>
            {t.investmentProperty}
          </div>
          <div className='mt-1 text-3xl font-bold'>
            ${maxSupply?.toNumber().toLocaleString()}
          </div>
          {bought && maxSupply && (
            <>
              <div className='mt-8'>
                <Progress
                  percent={(bought.toNumber() / maxSupply.toNumber()) * 100}
                />
              </div>
              <div className='mt-1 flex justify-between'>
                <div>
                  <p className='text-xl font-bold'>
                    ${bought.toNumber().toLocaleString()}
                  </p>
                  <p className='text-xs opacity-60'>{t.sold}</p>
                </div>
                <div>
                  <p className='text-right text-xl font-bold'>
                    ${maxSupply.toNumber().toLocaleString()}
                  </p>
                  <p className='text-right text-xs opacity-60'>{t.total}</p>
                </div>
              </div>
            </>
          )}

          <div className='mt-3 flex flex-col gap-3 divide-y text-xs font-bold'>
            <div className='flex items-center gap-3 rounded-lg py-3'>
              <Dividends />
              <div>
                <div className='opacity-60'>{t.roiPerYear}</div>
                <div className='text-sm'>
                  {
                    metadata.attributes.find(
                      (it) => it.trait_type === 'ROI per year'
                    )?.value
                  }
                </div>
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-lg py-3'>
              <Valueation />
              <div>
                <div className='opacity-60'>{t.estimatedRent}</div>
                <div className='text-sm'>
                  {
                    metadata.attributes.find(
                      (it) => it.trait_type === 'Estimated rent per night'
                    )?.value
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        {isActive && (
          <>
            {balance && balance.gt(0) ? (
              <>
                {maxSupply && bought && (
                  <div className='mt-8 rounded-lg bg-white pt-8'>
                    <div className='text-center font-bold opacity-60'>
                      {t.howMuchDoYouWantToInvest}
                    </div>
                    <div className='flex items-center justify-center p-8'>
                      <input
                        value={`$${tokenAmount}`}
                        className=' w-full text-center text-5xl font-bold text-slate-400'
                        onChange={(e) => {
                          const number = e.target.value.split('$')[1];
                          try {
                            if (number.length === 0) {
                              setTokenAmount(BigNumber.from(0));
                            } else {
                              setTokenAmount(BigNumber.from(number));
                            }
                          } catch (error) {
                            /* empty */
                          }
                        }}
                      />
                    </div>
                    <div className='flex items-center justify-between border-t p-8'>
                      {allowance?.gte(tokenAmount) ? (
                        <>
                          {tokenAmount.lte(maxSupply?.sub(bought)) ? (
                            <Button
                              className={`${
                                tokenAmount.eq(0) && 'opacity-30'
                              } flex w-full justify-center`}
                              isLoading={isLoadingMint}
                              disabled={tokenAmount.eq(0) || !writeMint}
                              onClick={() => writeMint?.()}
                            >
                              <div>{t.invest}</div>
                            </Button>
                          ) : (
                            <div className='rounded bg-red-600 p-3 font-bold text-white'>
                              &gt; {t.maxSupply}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            isLoading={isLoadingAllowance}
                            onClick={() => writeAllowance?.()}
                            disabled={!writeAllowance}
                          >
                            {t.approveContract}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className='mt-8 flex flex-col items-center gap-8 rounded-lg bg-white p-8'>
                <LogoLarge />
                <div className='text-center text-xl font-bold opacity-60'>
                  {t.youNeedASamanaCitizenNFTToParticipate}
                </div>
              </div>
            )}
          </>
        )}

        {!isActive && (
          <div className='mt-8 flex flex-col items-center gap-6 rounded-lg bg-white p-8'>
            <LogoLarge />
            <div className='text-center text-xl font-bold opacity-60'>
              {t.currentlyNotForSale}
            </div>
            <UnstyledLink href='https://forms.gle/k8wMq1RgbYy7NNWD7'>
              <Button variant='ghost' className='shadow'>
                {t.registerInterest}
              </Button>
            </UnstyledLink>
          </div>
        )}
      </div>

      <div className='col-span-full '>
        <div className='rounded-lg bg-white p-8'>
          <div className='text-4xl font-bold'>{metadata.name}</div>
          {/* <div className='mt-8 font-bold'>Details</div> */}
          <div className='mt-8 grid grid-cols-2 gap-3'>
            <div className='rounded-lg bg-lightgrey p-3'>
              <div className='text-xs font-bold opacity-60'>{t.total}</div>
              <div className='mt-1 text-xl font-bold'>
                {maxSupply?.toString()}
              </div>
            </div>
            <div className='rounded-lg bg-lightgrey p-3'>
              <div className='text-xs font-bold opacity-60'>{t.roiPerYear}</div>
              <div className='mt-1 text-xl font-bold'>
                {
                  metadata.attributes.find(
                    (it) => it.trait_type === 'ROI per year'
                  )?.value
                }
              </div>
            </div>
          </div>

          <div className='prose mt-8 w-full whitespace-pre-line font-medium opacity-60'>
            <ReactMarkdown className='w-full'>
              {decodeURIComponent(
                escape(
                  locale === 'es'
                    ? metadata.description_es
                    : metadata.description
                )
              )}
            </ReactMarkdown>
          </div>

          <div className='mt-16'>
            <div className='text-xl font-bold'>{t.details}</div>

            <div className='mt-4'>
              <div className='divide-y'>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.location}</div>
                  <div className='font-bold opacity-60'>
                    {decodeURIComponent(
                      escape(
                        metadata.attributes.find(
                          (it) => it.trait_type === 'Location'
                        )?.value || ''
                      )
                    )}
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.roiPerYear}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) => it.trait_type === 'ROI per year'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.roiFromSale}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) => it.trait_type === 'ROI from sale'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.estimatedNetRoi}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) => it.trait_type === 'Estimated Net ROI in 5 years'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.estimatedRent}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) => it.trait_type === 'Estimated rent per night'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.constructionTime}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) => it.trait_type === 'Construction time'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.constructionCost}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) => it.trait_type === 'Construction cost'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.valuationCompletion}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) =>
                          it.trait_type ===
                          'Valuation of construction at completion'
                      )?.value
                    }
                  </div>
                </div>
                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.valuationFiveYears}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) =>
                          it.trait_type ===
                          'Valuation of construction in 5 years'
                      )?.value
                    }
                  </div>
                </div>

                <div className='flex justify-between gap-8 py-2'>
                  <div className='font-bold'>{t.stipulatedRentalPeriod}</div>
                  <div className='font-bold opacity-60'>
                    {
                      metadata.attributes.find(
                        (it) =>
                          it.trait_type ===
                          'Stipulated rental period before sale'
                      )?.value
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
