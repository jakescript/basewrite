'use client'
import { useAppContext } from "./context"

const ProgressBar = () => {
  const { availableChars, initialLimits } = useAppContext()

  if (!availableChars) {
    return
  }

  const usedCount = initialLimits - availableChars

  return (
    <div 
      className="w-[100vw] h-[5px] bg-gray-100"
    >
      <div
        className='h-full bg-black rounded'
        style={{
          width: (usedCount / initialLimits) * 100 + '%',
          transition: 'width 0.2s ease-in-out',
          backgroundColor: availableChars > 0 ? 'black' : 'red'
        }}
      >
      </div>
    </div>
  )
}

export default ProgressBar
