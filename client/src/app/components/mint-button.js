'use client'
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import disk from '../util/Disk.json'

export default function MintButton() {
  const {
    data: txHash,
    writeContract,
    isPending,
    error
  } = useWriteContract()

  const {
    isLoading,
    isSuccess
  } = useWaitForTransactionReceipt({
    hash: txHash
  })

  const handleMint = () => {
    writeContract({
      address: '0xC3D5EB67D166bCb2a8680d20ad3E5E3b9e19b29B',
      abi: disk?.abi,
      functionName: 'mint'
    })
  }

  console.log({
    txHash,
    isPending,
    isLoading,
    isSuccess,
    error
  })

  return (
    <button
      disabled={isPending}
      onClick={handleMint}
      className='bg-black border text-white font-regular w-full'
      style={{ padding: '8px 30px', marginTop: 20, borderRadius: 50 }}
    >
      { isPending ? 'Minting...' : 'Mint Now'}
    </button>
  )
}
