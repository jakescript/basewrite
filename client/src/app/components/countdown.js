import React, { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { useSelector } from 'react-redux'
import baseWrite from '../util/BaseWrite.json'
import moment from 'moment'

const Countdown = () => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const currentStoryId = useSelector(s => s.story.currentStoryId)

  // read address's balanceOf disks
  const { data, error } = useReadContract({
    address: process.env.NEXT_PUBLIC_STORY_ADDRESS,
    abi: baseWrite?.abi,
    functionName: "stories",
    args: [currentStoryId],
    query: {
      enabled: !!currentStoryId,
    },
  })

  const storyEnd = moment.unix(Number(data?.[1])).add(24, 'hours')

  useEffect(() => {
    if (!storyEnd) {
      return
    }

    const interval = setInterval(() => {
      const now = moment()
      const diff = storyEnd.diff(now)
      setTimeRemaining(diff)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [storyEnd])

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return (
    <div className='px-[15px] pt-[10px]'>
      <p>
        {hours.toString().padStart(2, '0')}:
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </p>
    </div>
  )
}

export default Countdown
