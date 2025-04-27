'use client'

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button";
import { createContribution } from "@/lib/actions";
import { diffChars } from "diff";
import { useAccount } from "wagmi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import baseWrite from '../util/BaseWrite.json'
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setContributions } from "@/lib/storySlice";
import { DiffView } from "./contributions";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";

const ContributeButton = () => {
  const dispatch = useDispatch()
  const tokenIds = useSelector(s => s.token.tokenIds)
  const tokenMap = useSelector(s => s.token.tokenMap)
  const availableChars = useSelector(s => s.token.availableChars)
  const initialLimit = useSelector(s => s.token.initialLimit)
  const currentStoryId = useSelector(s => s.story.currentStoryId)
  
  const writeInput = useSelector(s => s.story.writeInput)
  const currentStory = useSelector(s => s.story.currentStory)
  const contributions = useSelector(s => s.story.contributions)

  const [showModal, setShowModal] = useState(false)

  const { address } = useAccount()

  const {
    data: txHash,
    writeContract,
    isPending, // waiting for approval in app
    error
  } = useWriteContract()

  // save to upload to db offically if isSuccess
  const contributionRef = useRef(null)

  const {
    isLoading,
    isSuccess
  } = useWaitForTransactionReceipt({
    hash: txHash
  })

  useEffect(() => {
    let toastId
    if (error) {
      toastId = toast.error(error.shortMessage.toString())
    }

    return () => {
      toast.dismiss(toastId)
    }
  }, [error])

  useEffect(() => {
    let toastId = null
    if (isLoading) {
      toastId = toast.loading('Pending')
    }

    return () => {
      toast.dismiss(toastId)
    }
  }, [isLoading])

  useEffect(() => {
    let toastId = null
    if (isPending) {
      toastId = toast.loading('Waiting approval')
    }

    return () => {
      toast.dismiss(toastId)
    }
  }, [isPending])

  const contribute = async () => {
    const cost = initialLimit - availableChars
    
    // to do: handle cost spill over
    const tokenToUse = Object.values(tokenMap)
      .find(token => token.initialLimit > cost)

    console.log({ 
      tokenToUse,
      tokenMap,
      cost
    })

    const contribution = {
      storyId: currentStoryId,
      tokenId: tokenToUse.id,
      cost: initialLimit - availableChars,
      author: address,
      content: writeInput,
      ipfsUri: ''
    }

    if (!contribution.storyId) {
      throw new Error('Contribution must have a storyId')
    }

    contributionRef.current = contribution

    writeContract({
      address: process.env.NEXT_PUBLIC_STORY_ADDRESS,
      abi: baseWrite?.abi,
      functionName: 'contribute',
      args: [
        currentStoryId,
        tokenToUse.id,
        initialLimit - availableChars
      ]
    })

    setShowModal(false)
  }

  // once transaction is successful save contribution
  useEffect(() => {
    if (!isSuccess || !contributionRef.current) {
      return
    }

    createContribution(contributionRef.current)
      .then(res => {
        dispatch(setContributions([{ ...res, createdAt: res.createdAt.toDateString() }, ...contributions]))
        toast('Contribution Created!')
      })
      .catch(e => {
        toast.error(e.message)
      })
  }, [isSuccess, contributionRef])

  const diffs = diffChars(currentStory, writeInput)

  const disabled = !!(
    !tokenIds.length ||
    isPending ||
    isLoading ||
    !diffs.length
  )

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <form>
        <DialogTrigger asChild>
          <Button className='w-full'>Contribute</Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[700px]" >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="h-[300px] flex flex-col">
            <div className='mb-[24px]'>
              <Label>Confirm your revision</Label>
              <p>
                Review your changes before submitting. Additions are highlighted in green, and removals in red.
              </p>
            </div>
            <div className="flex-1 overflow-auto bg-secondary-background p-[10px]">
              <DiffView 
                content={currentStory}
                current={writeInput}
                show={diffs}
              />
            </div>
          </div>
          <DialogFooter className='mt-[50px]'>
            <DialogClose asChild>
              <Button variant="neutral">Cancel</Button>
            </DialogClose>
            <Button type='submit' disabled={disabled} onClick={contribute}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default ContributeButton
