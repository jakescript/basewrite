'use client'

import UserInfo from "../components/user-info"
import StoryTextArea from "../components/story-textarea"
import ProgressBar from "../components/progress-bar"
import ContributeButton from "../components/contribute-button"
import Contributions from "../components/contributions"
import StoryInfo from "../components/story-info"
import Countdown from "../components/countdown"

export default function Write() {
  return (
    <>
      <ProgressBar />
      <Countdown />
      <div className="bg-background p-[15px] h-full">
        <div className='flex gap-[20px] flex-col md:flex-row'>
          <div className='flex-2 h-full'>
            <StoryTextArea />
            <StoryInfo />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-[10px]">
              <UserInfo />
              <ContributeButton />
            </div>
          </div>
        </div>

        <Contributions />
      </div>
    </>
  )
}
