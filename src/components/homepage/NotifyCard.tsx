import { useRouter } from 'next/router';
import React from 'react';

import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';

import en from '@/locale/en';
import es from '@/locale/es';

const NotifyCard = () => {
  const { locale } = useRouter();
  const t = locale === 'es' ? es : en;

  return (
    <div className='flex h-full flex-col rounded-lg bg-green/40 p-8 text-white'>
      <div className='text-5xl font-bold'>{t.alwaysBeFirst}</div>
      <div className='mt-8 text-xl font-bold'>{t.getNotified2}</div>
      <div className='mt-auto pt-4'>
        <UnstyledLink href='https://forms.gle/k8wMq1RgbYy7NNWD7'>
          <Button variant='ghost'>{t.getNotifiedButton}</Button>
        </UnstyledLink>
      </div>
    </div>
  );
};

export default NotifyCard;
