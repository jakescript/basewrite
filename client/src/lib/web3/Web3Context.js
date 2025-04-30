import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { getContract } from 'viem';
import diskArtifact from '@/app/util/Disk.json';
import baseWriteArtifact from '@/app/util/BaseWrite.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [diskContract, setDiskContract] = useState(null);
  const [baseWriteContract, setBaseWriteContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    const initializeContracts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize contracts here when we have the client
        // This will be implemented when we have the wagmi client setup

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (isConnected) {
      initializeContracts();
    }
  }, [isConnected, chain]);

  const value = {
    diskContract,
    baseWriteContract,
    isLoading,
    error,
    address,
    isConnected,
    connect,
    disconnect,
    connectors,
    chain,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
} 