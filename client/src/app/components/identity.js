"use client"
import { useEffect, useMemo, useState } from "react"
import { usePublicClient, useAccount, useEnsAvatar, useEnsName, useReadContract, useDisconnect } from "wagmi"
import WalletButton from "./wallet-button"
import Image from "next/image"
import disk from "../util/Disk.json"
import { createAvatar } from "@dicebear/core"
import { glass } from "@dicebear/collection"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch } from "react-redux"
import { setTokenIds } from "@/lib/tokenSlice"
import { wagmiConfig } from "./providers"
import { LogOut, Copy, Sun, Moon } from "lucide-react"

import { toast } from "sonner"

const Idendity = () => {
  const dispatch = useDispatch()

  const client = usePublicClient({
    config: wagmiConfig
  })

  const { address } = useAccount()

  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })
  const { disconnect } = useDisconnect()
  const [theme, setTheme] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme")

      if (storedTheme) {
        setTheme(storedTheme)
        document.body.classList.toggle("dark", storedTheme === "dark")
      } else if (typeof storedTheme != 'string') {
        // Check system preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (systemPrefersDark) {
          setTheme("dark")
          document.body.classList.add("dark")
        }
      }
    }
  }, [])

  const avatar = useMemo(() => {
    return createAvatar(glass, {
      seed: address,
      size: 50,
      radius: 0,
    }).toDataUri()
  }, [address])

  // read address's balanceOf disks
  const { data: balance } = useReadContract({
    address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
    abi: disk?.abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
    },
  })

  // get all of the address's token ids
  const getTokenIds = async (address, balance) => {
    try {
      const promises = []

      /* tokenOfOwnerByIndex
        * will return a mapping for an address
        * that looks like mapping(uint => uint tokenId)
      */
      for (let i = 0; i < balance; i++) {
        promises.push(
          client.readContract({
            address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
            abi: disk?.abi,
            functionName: "tokenOfOwnerByIndex",
            args: [address, i],
          }),
        )
      }

      const tokenIds = (await Promise.all(promises))?.map((id) => Number(id))
      dispatch(setTokenIds(tokenIds))
    } catch (e) {
      console.log("getTokenIds", { error: e })
    }
  }

  // once unauthenticated and if they own a disk
  // fetch all their tokenIds
  useEffect(() => {
    if (!address || !balance) {
      return
    }

    getTokenIds(address, balance)
  }, [address, balance])

  const handleCopyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      toast("Address Copied")
      console.log("Address copied to clipboard:", address)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  const toggleMode = () => {
    const newTheme = theme === "dark" ? "" : "dark"
    document.body.classList.toggle("dark", newTheme === "dark")
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    toast(`${newTheme === "dark" ? "Dark" : "Light"} mode activated`)
  }

  // unauthenticated button
  if (!address) {
    return <WalletButton />
  }

  return (
    <div className="flex gap-[20px] items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar || "/placeholder.svg"} />}
              {address && (
                <div className="whitespace-nowrap w-[100px] overflow-hidden text-ellipsis">
                  {ensName ? `${ensName} (${address})` : address}
                </div>
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 m-[16px]">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleCopyAddress}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={disconnect}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Disconnect</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={toggleMode}>
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Idendity
