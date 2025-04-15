'use client'

import UserInfo from "../components/user-info"
import StoryTextArea from "../components/story-textarea"
import ProgressBar from "../components/progress-bar"
import ContributeButton from "../components/contribute-button"

export default function Write() {
  return (
    <div className="bg-secondary-background" style={{ height: 'calc(100vh - 75px'}}>
      <ProgressBar />
      <div className='flex gap-[20px] h-[80vh] p-[15px] flex-col md:flex-row'>
        <div className='flex-2'>
          <StoryTextArea />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-[10px]">
            <UserInfo />
            <ContributeButton />
          </div>
        </div>
      </div>
    </div>
  )
}
