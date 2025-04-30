import { useState } from 'react';
import { useWeb3 } from '../Web3Context';

export function useBaseWrite() {
  const { baseWriteContract, isLoading, error } = useWeb3();
  const [isContributing, setIsContributing] = useState(false);
  const [contributionError, setContributionError] = useState(null);

  const contribute = async (storyId, diskId, contribution) => {
    if (!baseWriteContract) return;
    
    try {
      setIsContributing(true);
      setContributionError(null);
      
      // Contribute to the story
      const tx = await baseWriteContract.write.contribute([
        storyId,
        diskId,
        contribution
      ]);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      return true;
    } catch (err) {
      setContributionError(err.message);
      return false;
    } finally {
      setIsContributing(false);
    }
  };

  const getCurrentPrompt = async (storyId) => {
    if (!baseWriteContract) return '';
    
    try {
      const prompt = await baseWriteContract.read.getCurrentPrompt([storyId]);
      return prompt;
    } catch (err) {
      console.error('Error getting current prompt:', err);
      return '';
    }
  };

  const getStoryTimeRemaining = async (storyId) => {
    if (!baseWriteContract) return 0;
    
    try {
      const timeRemaining = await baseWriteContract.read.getStoryTimeRemaining([storyId]);
      return Number(timeRemaining);
    } catch (err) {
      console.error('Error getting story time remaining:', err);
      return 0;
    }
  };

  return {
    contribute,
    getCurrentPrompt,
    getStoryTimeRemaining,
    isContributing,
    contributionError,
    isLoading,
    error
  };
} 