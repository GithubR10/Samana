import { useRouter } from 'next/router';

import '/node_modules/flag-icons/css/flag-icons.min.css';

import UnstyledLink from '@/components/links/UnstyledLink';
import Discord from '@/components/svg/Discord';
import Home from '@/components/svg/Home';
import Instagram from '@/components/svg/Instagram';
import LogoLarge from '@/components/svg/LogoLarge';
import Telegram from '@/components/svg/Telegram';
import Twitter from '@/components/svg/Twitter';
import WalletDrawer from '@/components/svg/WalletDrawer';

import en from '@/locale/en';
import es from '@/locale/es';

const Drawer = () => {
  const router = useRouter();

  const t = router.locale === 'es' ? es : en;

  const toggleLanguage = () => {
    router.locale === 'es'
      ? router.push(router.asPath, router.asPath, { locale: 'en' })
      : router.push(router.asPath, router.asPath, { locale: 'es' });
  };

  return (
    <div className='sticky top-0 flex h-screen flex-col px-8 font-semibold'>
      <div className='mx-auto items-center border-b py-8'>
        <LogoLarge />
      </div>
      <UnstyledLink
        href='/'
        className={`mt-3 flex w-full cursor-pointer gap-3 rounded-lg py-3 px-2 hover:bg-turquoise/30 ${
          router.pathname === '/' && 'bg-turquoise/30'
        }`}
      >
        <Home /> Home
      </UnstyledLink>
      <UnstyledLink
        href='/profile'
        className={`mt-2 flex w-full cursor-pointer gap-3 rounded-lg py-3 px-2 hover:bg-turquoise/30 ${
          router.pathname.includes('profile') && 'bg-turquoise/30'
        }`}
      >
        <WalletDrawer /> {t.profile}
      </UnstyledLink>

      <UnstyledLink
        href='https://discord.gg/Tgca4KmP9S'
        className='mt-auto flex w-full cursor-pointer items-center gap-3 rounded-lg py-3 px-2 hover:bg-turquoise/30'
      >
        <Discord /> Discord
      </UnstyledLink>

      <UnstyledLink
        href='https://twitter.com/samana_citizens'
        className=' flex w-full cursor-pointer items-center gap-3 rounded-lg py-3 px-2 hover:bg-turquoise/30'
      >
        <Twitter /> Twitter
      </UnstyledLink>

      <UnstyledLink
        href='https://t.me/samanacitizens'
        className='flex w-full cursor-pointer items-center gap-3 rounded-lg py-3 px-2 hover:bg-turquoise/30'
      >
        <Telegram /> Telegram
      </UnstyledLink>

      <UnstyledLink
        href='https://www.instagram.com/elvalleecoluxury'
        className='mb-2 flex w-full cursor-pointer items-center gap-3 rounded-lg py-3 px-2 hover:bg-turquoise/30'
      >
        <Instagram /> Instagram
      </UnstyledLink>

      <hr className='mb-2' />

      <div
        onClick={toggleLanguage}
        className='mb-8 cursor-pointer rounded-lg px-2 py-3 hover:bg-turquoise/30'
      >
        {router.locale === 'es' ? (
          <span>
            <span className='fi fi-gb mr-3 rounded' />
            English
          </span>
        ) : (
          <span>
            <span className='fi fi-es mr-3 rounded' />
            Español
          </span>
        )}
      </div>
    </div>
  );
};

export default Drawer;
