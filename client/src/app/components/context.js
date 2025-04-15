import { createContext, useState, useContext, useEffect } from "react"
import { usePublicClient } from "wagmi"
import { wagmiConfig } from "./providers"
import disk from '../util/Disk.json'

export const AppContext = createContext()
export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({ children }) => {
  // optional use read only rpc client
  const client = usePublicClient({
    config: wagmiConfig
  })

  const [tokenIds, setTokenIds] = useState([])
  const [tokenMap, setTokenMap] = useState({})
  const [availableChars, setAvailableChars] = useState(0)
  const [initialLimits, setInitialLimits] = useState(0)

  const [loadedDisk, setLoadedDisk] = useState(null)

  const [currentStory, setCurrentStory] = useState('There was once a man!')
  const [writeInput, setWriteInput] = useState('There was once a man!')

  const createTokenMap = async (ids) => {
    const initialCharPromises = []
    const usedCharPromises = []

    for(let i = 0; i < ids.length; i++) {
      initialCharPromises.push(client.readContract({
        address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
        abi: disk?.abi,
        functionName: 'charLimits',
        args: [ ids[i] ],
      }))

      usedCharPromises.push(client.readContract({
        address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
        abi: disk?.abi,
        functionName: 'usedChars',
        args: [ ids[i] ],
      }))
    }

    const [initialLimits, usedChars] = await Promise.all([Promise.all(initialCharPromises), Promise.all(usedCharPromises)])

    const map = {}
    ids.forEach((id, i) => {
      map[id] = {
        id: Number(id),
        initialLimit: Number(initialLimits[i]),
        usedChars: Number(usedChars[i])
      }
    })

    if (Object.keys(map).length) {
      // set the inital loaded disk to
      // whateer the first id was for now
      setLoadedDisk(map[ids[0]])
    }

    setTokenMap(map)
  }

  const resetState = () => {
    setTokenIds([])
    setTokenMap({})
    setAvailableChars(0)
    setInitialLimits(0)
  }

  useEffect(() => {
    if (!tokenIds) {
      return
    }

    createTokenMap(tokenIds)
  }, [tokenIds])

  useEffect(() => {
    let _availableChars = 0
    let _initalLimits = 0

    Object.entries(tokenMap).map(([i, token]) => {
      const remaining = token.initialLimit - token.usedChars

      _availableChars += remaining
      _initalLimits += token.initialLimit
    })

    setAvailableChars(_availableChars)
    setInitialLimits(_initalLimits)
  }, [tokenMap])

  return (
    <AppContext.Provider 
      value={{
        tokenIds,
        setTokenIds,
        client,
        tokenMap,
        availableChars,
        initialLimits,
        setAvailableChars,
        resetState,
        currentStory,
        setCurrentStory,
        writeInput,
        setWriteInput,
        loadedDisk,
        setLoadedDisk
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
