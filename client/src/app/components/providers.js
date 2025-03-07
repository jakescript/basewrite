'use client';
 
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
 
const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    // coinbaseWallet({
    //   appName: 'onchainkit',
    // }),
    metaMask()
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http()
  },
});
 
export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
