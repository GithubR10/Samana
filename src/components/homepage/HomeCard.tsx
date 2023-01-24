import { useRouter } from 'next/router';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import Button from '@/components/buttons/Button';
import Progress from '@/components/Progress';
import Dividends from '@/components/svg/Dividends';
import Valueation from '@/components/svg/Valueation';

import en from '@/locale/en';
import es from '@/locale/es';

type Props = {
  img: string;
  name: string;
  description: string;
  totalTokens: number;
  soldTokens: number;
  roi: string;
  rent: string;
  id: number;
};

const HomeCard = ({
  img,
  name,
  description,
  totalTokens,
  soldTokens,
  roi,
  rent,
  id,
}: Props) => {
  const { push, locale } = useRouter();

  const t = locale === 'es' ? es : en;

  return (
    <div className='grid w-full grid-cols-1 overflow-hidden rounded-lg bg-white lg:grid-cols-2'>
      <div className='relative min-h-[400px]'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={name}
          className='h-full w-full'
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className='p-8'>
        <div className='mt-6 text-4xl font-bold'>{name}</div>
        <div className='prose mt-1 whitespace-pre-line opacity-60'>
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>

        <div className='mt-8'>
          <Progress percent={(soldTokens / totalTokens) * 100} />
        </div>
        <div className='mt-1 flex justify-between'>
          <div>
            <p className='text-xl font-bold'>${soldTokens}</p>
            <p className='text-xs opacity-60'>{t.sold}</p>
          </div>
          <div>
            <p className='text-right text-xl font-bold'>${totalTokens}</p>
            <p className='text-right text-xs opacity-60'>{t.total}</p>
          </div>
        </div>

        <div className='mt-8'>
          <div className=' text-xs font-bold opacity-60'>{t.youReceive}</div>

          <div className='mt-3 flex gap-3 text-xs font-bold'>
            <div className='flex w-1/2 items-center gap-3 rounded-lg border p-3'>
              <Dividends />
              <div>
                <div className='opacity-60'>{t.roiPerYear}</div>
                <div className='text-sm'>{roi}</div>
              </div>
            </div>
            <div className='flex w-1/2 items-center gap-3 rounded-lg border p-3'>
              <Valueation />
              <div>
                <div className='opacity-60'>{t.rentPerNight}</div>
                <div className='text-sm'>{rent}</div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 flex items-center justify-end'>
          {/* <div className='text-xl font-bold'>{price}</div> */}
          <Button className='px-12' onClick={() => push(`/${id}`)}>
            {t.invest}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
