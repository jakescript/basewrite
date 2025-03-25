'use client'
import { useConnect } from 'wagmi'
import { metaMask } from 'wagmi/connectors'

const WalletButton = () => {
  const { connectors, connect } = useConnect()

  return (
    <>
      <button
        onClick={() => connect({ connector: metaMask() })}
        className='bg-white border text-black font-bold box-border'
        style={{ padding: '8px 30px' }}
      >
        Connect Wallet
      </button>
    </>
  )
}

export default WalletButton
