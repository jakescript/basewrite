'use client'
import { useAppContext } from "./context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'

const UserInfo = () => {
  const { availableChars, tokenMap, loadedDisk, setLoadedDisk } = useAppContext()

  const tokens = Object.values(tokenMap)

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>User Info</CardTitle>
        <CardDescription>Other stuff</CardDescription>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <Label>Remaining Characters: {availableChars}</Label>
        {tokens.length ? (
          <div className="flex flex-col gap-2">
            { tokens.map(token => (
              <Label key={token.id}>
                Disk #{token.id}: {token.initialLimit} {token.usedChars}&nbsp;
                { loadedDisk?.id === token.id ? '[Loaded]' : (
                  <Button
                    variant='noShadow'
                    size='sm'
                    onClick={() => setLoadedDisk(token)}
                  >
                    Load
                  </Button>
                )}
              </Label>
            ))}
          </div>
        ) : null }
      </CardContent>
    </Card>
  )
}

export default UserInfo
