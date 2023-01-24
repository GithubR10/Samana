import { AppProps } from 'next/app';
import Head from 'next/head';
import { Chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import '@/styles/globals.css';

import Layout from '@/components/layout/Layout';

// const polygonMumbaiChain: Chain = {
//   id: 80_001,
//   name: 'Mumbai Testnet',
//   network: 'mumbai',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Matic',
//     symbol: 'MATIC',
//   },
//   rpcUrls: {
//     default: 'https://polygon-mumbai.g.alchemy.com/v2/',
//   },
//   blockExplorers: {
//     default: { name: 'Polygon Scan', url: 'https://polygonscan.com/' },
//   },
//   testnet: true,
// };

export const polygonChain: Chain = {
  id: 137,
  name: 'Polygon Mainnet',
  network: 'polygon',
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: 'https://polygon-mainnet.g.alchemy.com/v2/',
  },
  blockExplorers: {
    default: { name: 'Polygon Scan', url: 'https://polygonscan.com/' },
  },
  testnet: false,
};

const { chains, provider, webSocketProvider } = configureChains(
  [polygonChain],
  [
    alchemyProvider({ apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` }),
    jsonRpcProvider({
      rpc: () => ({
        http: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        webSocket: `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      }),
    }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'samana cititzen',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Samana Cititzens</title>
      </Head>
      <WagmiConfig client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
