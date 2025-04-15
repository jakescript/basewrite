'use client'
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import disk from '../util/Disk.json'
import { Button } from "@/components/ui/button"

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
      address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
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
    <Button
      disabled={isPending}
      onClick={handleMint}
      className='mt-[20px] w-full'
    >
      { isPending ? 'Minting...' : 'Mint Now'}
    </Button>
  )
}
