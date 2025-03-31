import UserInfo from "../components/user-info"
import StoryTextArea from "../components/story-textarea"
import ProgressBar from "../components/progress-bar"

export default function Write() {
  return (
    <div>
      <ProgressBar />
      <div className='flex gap-[20px] h-[80vh] p-[15px]'>
        <div className='flex-2'>
          <StoryTextArea />
        </div>
        <div className="flex-1">
          <UserInfo />
        </div>
      </div>
    </div>
  )
}
