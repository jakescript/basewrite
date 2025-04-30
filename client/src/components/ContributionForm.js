import { useState, useEffect } from 'react';
import { useDisk } from '../lib/web3/hooks/useDisk';
import { useBaseWrite } from '../lib/web3/hooks/useBaseWrite';
import { useWeb3 } from '../lib/web3/Web3Context';

export function ContributionForm({ storyId, diskId }) {
  const { isConnected } = useWeb3();
  const { getRemainingChars } = useDisk();
  const { contribute, getCurrentPrompt, getStoryTimeRemaining } = useBaseWrite();
  
  const [contribution, setContribution] = useState('');
  const [remainingChars, setRemainingChars] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (isConnected && diskId) {
        const chars = await getRemainingChars(diskId);
        setRemainingChars(chars);
      }
    };
    loadData();
  }, [isConnected, diskId, getRemainingChars]);

  useEffect(() => {
    const loadPrompt = async () => {
      if (isConnected && storyId) {
        const prompt = await getCurrentPrompt(storyId);
        setCurrentPrompt(prompt);
      }
    };
    loadPrompt();
  }, [isConnected, storyId, getCurrentPrompt]);

  useEffect(() => {
    const loadTimeRemaining = async () => {
      if (isConnected && storyId) {
        const time = await getStoryTimeRemaining(storyId);
        setTimeRemaining(time);
      }
    };
    loadTimeRemaining();
  }, [isConnected, storyId, getStoryTimeRemaining]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!contribution.trim()) {
      setError('Contribution cannot be empty');
      return;
    }

    if (contribution.length > remainingChars) {
      setError(`Contribution exceeds remaining characters (${remainingChars})`);
      return;
    }

    const success = await contribute(storyId, diskId, contribution);
    if (success) {
      setContribution('');
      // Refresh data
      const chars = await getRemainingChars(diskId);
      setRemainingChars(chars);
      const prompt = await getCurrentPrompt(storyId);
      setCurrentPrompt(prompt);
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet to contribute</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Current Prompt:</h3>
        <p className="text-gray-700">{currentPrompt || 'No prompt yet'}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Time Remaining:</h3>
        <p className="text-gray-700">
          {timeRemaining > 0 
            ? `${Math.floor(timeRemaining / 3600)}h ${Math.floor((timeRemaining % 3600) / 60)}m`
            : 'Story has ended'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contribution" className="block text-sm font-medium text-gray-700">
            Your Contribution
          </label>
          <textarea
            id="contribution"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
            placeholder="Add to the prompt..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Remaining characters: {remainingChars}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={!contribution.trim() || contribution.length > remainingChars}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Contribute
        </button>
      </form>
    </div>
  );
} 