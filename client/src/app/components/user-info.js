'use client'
import { useAppContext } from "./context"

const UserInfo = () => {
  const { availableChars } = useAppContext()

  return (
    <div>
      <p>User Info</p>
      <p>Available Chars: {availableChars}</p>
    </div>
  )
}

export default UserInfo
