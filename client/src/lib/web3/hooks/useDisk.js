import { useState } from 'react';
import { useWeb3 } from '../Web3Context';
import { parseEther } from 'viem';

export function useDisk() {
  const { diskContract, isLoading, error } = useWeb3();
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState(null);

  const mintDisk = async () => {
    if (!diskContract) return;
    
    try {
      setIsMinting(true);
      setMintError(null);
      
      // Get the mint price from the contract
      const mintPrice = await diskContract.read.mintPrice();
      
      // Mint the disk
      const tx = await diskContract.write.mint({
        value: mintPrice
      });
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      return true;
    } catch (err) {
      setMintError(err.message);
      return false;
    } finally {
      setIsMinting(false);
    }
  };

  const getRemainingChars = async (tokenId) => {
    if (!diskContract) return 0;
    
    try {
      const remaining = await diskContract.read.getRemainingChars([tokenId]);
      return Number(remaining);
    } catch (err) {
      console.error('Error getting remaining chars:', err);
      return 0;
    }
  };

  return {
    mintDisk,
    getRemainingChars,
    isMinting,
    mintError,
    isLoading,
    error
  };
} 