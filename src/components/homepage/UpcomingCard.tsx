import { useRouter } from 'next/router';
import React from 'react';

import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';

import en from '@/locale/en';
import es from '@/locale/es';

type Props = {
  name: string;
  roi: string;
  img: string;
  id: number;
};

const UpcomingCard = ({ name, roi, img, id }: Props) => {
  const { locale } = useRouter();

  const t = locale === 'es' ? es : en;
  return (
    <div className='overflow-hidden rounded-lg bg-white'>
      <UnstyledLink href={`/${id}`}>
        <div className='relative h-64'>
          <div className='absolute left-3 z-50 mt-3 flex gap-3 font-semibold'>
            {/* <div className='rounded-full bg-black/40 p-1 px-3 text-white '>
            {price}
          </div> */}
            <div className='rounded-full bg-black/40 p-1 px-3 text-white '>
              {roi} {t.roiPerYear}
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={name}
            className='h-full w-full'
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className='border-b p-3 text-lg font-semibold'>{name}</div>
        <div className='p-3 opacity-60'>{t.getNotified1}</div>
      </UnstyledLink>
      <div className='bg-backgound p-3'>
        <Button variant='ghost' className='shadow'>
          <UnstyledLink href='https://forms.gle/k8wMq1RgbYy7NNWD7'>
            {t.registerInterest}
          </UnstyledLink>
        </Button>
      </div>
    </div>
  );
};

export default UpcomingCard;
