import { useRouter } from 'next/router';
import React from 'react';

import Button from '@/components/buttons/Button';

import en from '@/locale/en';
import es from '@/locale/es';

const EmptyUpcomingCard = () => {
  const { locale } = useRouter();
  const t = locale === 'es' ? es : en;
  return (
    <div className='overflow-hidden rounded-lg bg-white'>
      <div className='relative h-64 bg-gradient-to-br from-green/30 to-green'></div>
      <div className='border-b p-3 text-lg font-semibold'>{t.comingSoon}</div>
      <div className='p-3 opacity-60'>{t.getNotified1}</div>
      <div className='bg-backgound p-3'>
        <Button variant='ghost' className='shadow'>
          {t.registerInterest}
        </Button>
      </div>
    </div>
  );
};

export default EmptyUpcomingCard;
