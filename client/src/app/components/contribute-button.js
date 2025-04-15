'use client'

import { Button } from "@/components/ui/button";
import { useAppContext } from "./context";
import { diffChars } from "diff";

const ContributeButton = () => {
  const {
    currentStory,
    writeInput,
    availableChars,
    initialLimits,
    tokenIds,
    tokenMap
  } = useAppContext()


  const contribute = async () => {
    const tokenToUse = Object.values(tokenMap)
      .find(token => token.usedChars < token.initialLimit)

    console.log(tokenToUse)
    const diffs = diffChars(currentStory, writeInput)

    // const res = await fetch('/api/contribute', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     test: '123'
    //   })
    // })
  }

  return (
    <Button disabled={!tokenIds.length} onClick={contribute}>
      Contribute!
    </Button>
  )
}

export default ContributeButton
