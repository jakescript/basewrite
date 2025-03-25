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
      address: '0x3E86F36a750Ebb3F4B34eb85F2d5d9A876bE0DD8',
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
