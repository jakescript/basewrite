'use client'

import { useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { calculateCharacterCost } from "../util/utils"
import { useSelector, useDispatch } from "react-redux"
import { setAvailableChars } from "@/lib/tokenSlice"
import { setWriteInput } from "@/lib/storySlice"

const StoryTextArea = () => {
  const dispatch = useDispatch()
  const initialLimit = useSelector(s => s.token.initialLimit)
  const usedChars = useSelector(s => s.token.usedChars)

  const currentStory = useSelector(s => s.story.currentStory)
  const writeInput = useSelector(s => s.story.writeInput)

  const handleChange = (e) => {
    dispatch(setWriteInput(e.target.value))
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const characterCost = calculateCharacterCost(currentStory, writeInput)
      const newAvailableChars = (initialLimit - usedChars) - characterCost

      console.log({
        characterCost,
        newAvailableChars
      })

      dispatch(setAvailableChars(newAvailableChars))
    }, 250)

    return () => {
      clearTimeout(timeout)
    }
  }, [writeInput])


  return (
    <Textarea 
      value={writeInput}
      onChange={handleChange}
      rows={20}
      className="h-[500px] w-full"
      placeholder="A long time ago..."
      style={{ resize: 'none', padding: 10 }}
    />
  )
}

export default StoryTextArea
