'use client'

import { useEffect } from "react"
import { useAppContext } from "./context"
import { Textarea } from "@/components/ui/textarea"
import { calculateCharacterCost } from "../util/utils"

const StoryTextArea = () => {
  const { 
    setAvailableChars,
    initialLimits,
    writeInput,
    setWriteInput,
    currentStory
  } = useAppContext()

  const handleChange = (e) => {
    setWriteInput(e.target.value)
  }

  useEffect(() => {
    const characterCost = calculateCharacterCost(currentStory, writeInput)
    const newAvailableChars = initialLimits - characterCost
    setAvailableChars(newAvailableChars)
  }, [writeInput, currentStory, initialLimits, setAvailableChars])


  return (
    <Textarea 
      value={writeInput}
      onChange={handleChange}
      rows={20}
      className="h-full w-full"
      placeholder="A long time ago..."
      style={{ resize: 'none', padding: 10 }}
    />
  )
}

export default StoryTextArea
