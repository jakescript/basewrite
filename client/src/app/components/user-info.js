'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { useSelector } from "react-redux"

const UserInfo = () => {
  const availableChars = useSelector(s => s.token.availableChars)

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
        <CardDescription>Other stuff</CardDescription>
      </CardHeader>

      <CardContent>
        <Label>Remaining Characters: {availableChars}</Label>
      </CardContent>
    </Card>
  )
}

export default UserInfo
