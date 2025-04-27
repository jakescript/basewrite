'use client'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ProgressBar = () => {
  const availableChars = useSelector(s => s.token.availableChars)
  const initialLimit = useSelector(s => s.token.initialLimit)
  const [remaining, setRemaining] = useState(availableChars / initialLimit)

  useEffect(() => {
    setRemaining(availableChars / initialLimit)
  }, [availableChars, initialLimit])

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
