import { useEffect } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { wagmiConfig } from "./providers"
import { getStory } from "@/lib/actions"
import { useSelector, useDispatch } from "react-redux"
import {
  setTokenMap,
  setAvailableChars,
  setInitialLimit,
  setUsedChars
} from "@/lib/tokenSlice"
import { 
  setCurrentStory,
  setContributions,
  setWriteInput,
  setCurrentStoryId
} from "@/lib/storySlice"
import disk from '../util/Disk.json'
import baseWrite from '../util/BaseWrite.json'

export const AppBootstrap = ({ children }) => {
  const { address } = useAccount()
  const dispatch = useDispatch()
  const tokenIds = useSelector(s => s.token.tokenIds)
  const currentStoryId = useSelector(s => s.story.currentStoryId)

  // optional use read only rpc client
  const client = usePublicClient({
    config: wagmiConfig,
  })

  const init = async (ids, currentStoryId) => {
    const initialCharPromises = []

    for(let i = 0; i < ids.length; i++) {
      initialCharPromises.push(client.readContract({
        address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
        abi: disk?.abi,
        functionName: 'charLimits',
        args: [ ids[i] ],
      }))
    }

    const [ initialLimits, charactersUsed ] = await Promise.all([
      Promise.all(initialCharPromises),
      client.readContract({
        address: process.env.NEXT_PUBLIC_STORY_ADDRESS,
        abi: baseWrite?.abi,
        functionName: 'charactersUsed',
        args: [ currentStoryId, address ]
      })
    ])


    let totalLimits = 0
    const map = {}
    ids.forEach((id, i) => {
      map[id] = {
        id: Number(id),
        initialLimit: Number(initialLimits[i]),
      }

      totalLimits += Number(initialLimits[i])
    })

    const availableChars = totalLimits - Number(charactersUsed)

    console.log({ availableChars, totalLimits, map, charactersUsed })

    dispatch(setTokenMap(map))
    dispatch(setInitialLimit(totalLimits))
    dispatch(setAvailableChars(availableChars))
    dispatch(setUsedChars(Number(charactersUsed)))
  }

  const getCurrentStoryId = async () => {
    const storyCount = await client.readContract({
      address: process.env.NEXT_PUBLIC_STORY_ADDRESS,
      abi: baseWrite.abi,
      functionName: 'storyCount',
    })

    dispatch(setCurrentStoryId(Number(storyCount)))
  }

  useEffect(() => {
    getCurrentStoryId()
  }, [])

  useEffect(() => {
    if (!tokenIds.length && !currentStoryId) {
      return
    }

    init(tokenIds, currentStoryId)
  }, [tokenIds, currentStoryId])

  useEffect(() => {
    console.log('Check here', currentStoryId)
    if (!currentStoryId) {
      return
    }

    getStory(currentStoryId)
      .then((c => {
        if (!c?.length) {
          return
        }

        const recent= c[0]
        dispatch(setContributions(c.map(contribution => ({
          ...contribution,
          createdAt: contribution.createdAt.toDateString()
        }))))
        dispatch(setCurrentStory(recent.content))
        dispatch(setWriteInput(recent.content))
      }))
  }, [currentStoryId])

  console.log("currentStoryId", currentStoryId)

  return (
    <>
      {children}
    </>
  )
}
