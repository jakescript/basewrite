"use client"
import { useEffect, useMemo, useState } from "react"
import { useAccount, useEnsAvatar, useEnsName, useReadContract, useDisconnect } from "wagmi"
import WalletButton from "./wallet-button"
import Image from "next/image"
import disk from "../util/Disk.json"
import { useAppContext } from "./context"
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

import { LogOut, Copy, Sun, Moon } from "lucide-react"

import { toast } from "sonner"

const Idendity = () => {
  const { setTokenIds, client, resetState } = useAppContext()
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

  const { data: balance } = useReadContract({
    address: process.env.NEXT_PUBLIC_DISK_ADDRESS,
    abi: disk?.abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!address,
    },
  })

  const getTokenIds = async (address, balance) => {
    try {
      const promises = []

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
      setTokenIds(tokenIds)
    } catch (e) {
      console.log("getTokenIds", { error: e })
    }
  }

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

  const disconnectAndReset = () => {
    disconnect()
    resetState()
  }

  const toggleMode = () => {
    const newTheme = theme === "dark" ? "" : "dark"

    // Update DOM
    document.body.classList.toggle("dark", newTheme === "dark")

    // Update state
    setTheme(newTheme)

    // Save to localStorage
    localStorage.setItem("theme", newTheme)

    // Show toast notification
    toast(`${newTheme === "dark" ? "Dark" : "Light"} mode activated`)
  }

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
            <DropdownMenuItem onSelect={disconnectAndReset}>
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
