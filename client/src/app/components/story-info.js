'use client'

import { Label } from '@/components/ui/label'
import { useSelector } from "react-redux"

const StoryInfo = () => {
  const currentStoryId = useSelector(s => s.story.currentStoryId)
  const contributions = useSelector(s => s.story.contributions)

  const [latestContribution] = contributions

  return (
    <div className='mb-[16px] mt-[8px] flex justify-between'>
      <div className='flex gap-[20px]'>
        <Label>Story #{currentStoryId} ({contributions.length} Revisions)</Label>
      </div>
      { latestContribution && (
        <Label className='font-base'>Last update: {latestContribution.createdAt}</Label>
      )}
    </div>
  )
}

export default StoryInfo
