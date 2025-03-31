'use client';
 
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppContextProvider } from './context';

const queryClient = new QueryClient()
 
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // coinbaseWallet({
    //   appName: 'onchainkit',
    // }),
    metaMask()
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  },
});
 
export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
