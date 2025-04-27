'use client'

import React, { useMemo, useState } from 'react'
import { createAvatar } from "@dicebear/core"
import { glass } from "@dicebear/collection"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { diffChars } from 'diff'

const Contributions = () => {
  const contributions = useSelector(s => s.story.contributions)
  const currentStory = useSelector(s => s.story.currentStory)

  const [latestContribution] = contributions

  if (!contributions.length) {
    return null
  }

  return (
    <div className='mt-[16px] flex flex-col gap-[16px]'>
      <Label>Version History:</Label>
      {contributions.map((contribution) => (
        <ContributionItem 
          key={contribution.id}
          contribution={contribution} 
          currentStory={currentStory}
          latest={latestContribution}
        />
      ))}
    </div>
  )
}

const ContributionItem = ({ contribution, currentStory, latest }) => {
  const [showDiffs, setShowDiffs] = useState(false)

  const avatar = useMemo(() => {
    return createAvatar(glass, {
      seed: contribution.author,
      size: 20,
      radius: 0,
    }).toDataUri()
  }, [contribution.author])

  const handleCompare = () => {
    setShowDiffs(s => !s)
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex gap-2 items-center'>
          <Avatar className='h-[20px] w-[20px]'>
            <AvatarImage src={avatar || "/placeholder.svg"} />
          </Avatar>
          <CardTitle>
            <div>
              0x{contribution.author.slice(contribution.author.length - 5)}
            </div>
          </CardTitle>
          {latest.id === contribution.id && (
            <Label>(Latest)</Label>
          )}
        </div>
        <CardDescription>{contribution.createdAt.toString()}</CardDescription>
        <div>
          <Button
            variant='neutral'
            size='sm'
            onClick={handleCompare}
          >
            {showDiffs ? 'Hide' : 'Show' } Changes
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        { showDiffs ? (
          <DiffView
            content={contribution.content}
            current={currentStory}
            show={showDiffs}
          />
        ) : (
          <pre className='font-sans text-wrap'>
            {contribution.content}
          </pre>
        )}

      </CardContent>
    </Card>
  )
}

export const DiffView = ({ show, content, current }) => {
  const diffs = diffChars(content, current)

  if (!show) {
    return null
  }

  return (
    <pre className='font-sans text-wrap'>
      { diffs.map((diff, i) => (
        <span
          key={i}
          className={`
            ${diff.removed ? 'bg-red-300 text-red-800' : ''}
            ${diff.added ? 'bg-green-300 text-green-800' : ''}
          `}
        >
          {diff.value}
        </span>
      ))}
    </pre>
  )
}

export default Contributions
