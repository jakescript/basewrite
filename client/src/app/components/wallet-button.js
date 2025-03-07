'use client'
import { useConnect } from 'wagmi'

const WalletButton = () => {
  const { connectors, connect } = useConnect()

  return (
    <>
      {connectors.map((connector, i) => (
        <button
          onClick={() => connect({ connector })} key={i}
          className='bg-white border text-black font-bold box-border'
          style={{ padding: '8px 30px' }}
        >
          Connect Wallet
        </button>
      ))}
    </>
  )
}

export default WalletButton
