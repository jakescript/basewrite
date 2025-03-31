'use client'
import { useState } from "react"
import { useAppContext } from "./context"

const StoryTextArea = () => {
  const { setAvailableChars, initialLimits } = useAppContext()
  const [value, setValue] = useState('')
  const [previousValue, setPreviousValue] = useState('')

  const handleChange = (e) => {
    const currentVal = e.target.value

    const characterChange = currentVal.length - previousValue.length

    const newCount = initialLimits - characterChange

    setAvailableChars(newCount)
    setPreviousValue(previousValue)
    setValue(currentVal)
  }


  return (
    <textarea 
      value={value}
      onChange={handleChange}
      rows={20}
      className='border h-full w-full box-border outline-none'
      placeholder="A long time ago..."
      style={{ resize: 'none', padding: 10 }}
    />
  )
}

export default StoryTextArea
