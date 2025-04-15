'use client'
import { useConnect } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { Button } from '@/components/ui/button'

const WalletButton = () => {
  const { connectors, connect } = useConnect()

  return (
    <>
      <Button
        onClick={() => connect({ connector: metaMask() })}
      >
        Connect Wallet
      </Button>
    </>
  )
}

export default WalletButton
