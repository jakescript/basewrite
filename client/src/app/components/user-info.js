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
import { diffChars } from "diff"

const UserInfo = () => {
  const availableChars = useSelector(s => s.token.availableChars)
  const contributions = useSelector(s => s.story.contributions)

  const authorTotals = contributions.reduce((acc, c) => {
    if (!acc[c.author]) {
      acc[c.author] = 0
    }

    acc[c.author] += c.cost
    return acc
  }, {})

  return (
    <Card className='w-full'>
      {/* <CardHeader> */}
      {/*   <CardTitle>User Info</CardTitle> */}
      {/*   <CardDescription>Other stuff</CardDescription> */}
      {/* </CardHeader> */}

      <CardContent>
        <Label>Remaining Characters: {availableChars}</Label>

        <div>
          <Label>Contributors:</Label>
          { Object.keys(authorTotals).map((address) => (
            <p>0x{address.slice(address.length - 5)}: {authorTotals[address]}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserInfo
