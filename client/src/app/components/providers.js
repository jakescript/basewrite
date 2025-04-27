'use client';
 
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppBootstrap } from './app-bootstrap';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

const queryClient = new QueryClient()
 
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    // coinbaseWallet({
    //   appName: 'onchainkit',
    // }),
    metaMask()
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    // [base.id]: http()
  },
});
 
export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AppBootstrap>
            {children}
          </AppBootstrap>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
