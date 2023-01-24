import { useRouter } from 'next/router';
import React from 'react';

import en from '@/locale/en';
import es from '@/locale/es';

const HomeCard = () => {
  const { locale } = useRouter();

  const t = locale === 'es' ? es : en;
  return (
    <div className='grid w-full grid-cols-1 overflow-hidden rounded-lg bg-white lg:grid-cols-2'>
      <div className='relative min-h-[400px] bg-gradient-to-br from-green/30 to-green'></div>

      <div className='p-8'>
        <div className='mt-6 text-4xl font-bold'>{t.comingSoon}</div>
        <div className='mt-1 opacity-60'>{t.comeBackToSeeNewListingsSoon}</div>

        <div className='h-48'>{/* <Progress percent={45} /> */}</div>
      </div>
    </div>
  );
};

export default HomeCard;
