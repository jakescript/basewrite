'use client'
import { useState, useEffect } from 'react'
import { useAppContext } from "./context"

const ProgressBar = () => {
  const { availableChars, initialLimits } = useAppContext()
  const [remaining, setRemaining] = useState(availableChars / initialLimits)

  useEffect(() => {
    setRemaining(availableChars / initialLimits)
  }, [availableChars, initialLimits])

  if (!availableChars) {
    return
  }

  const percentage = Math.max(0, (remaining * 100))
  return (
    <div 
      className="w-[100vw] h-[5px] bg-background"
    >
      <div
        className='h-full bg-main'
        style={{
          width: `${percentage}%`,
          transition: 'width 0.2s ease-in-out',
          // backgroundColor: remaining < 0 ? 'black' : 'red'
        }}
      >
      </div>
    </div>
  )
}

export default ProgressBar
