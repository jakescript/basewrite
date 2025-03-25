'use client'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import WalletButton from './wallet-button'

const Idendity = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  if (!address) {
    return <WalletButton />
  }

  return (
    <div className='flex gap-[20px]'>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div className='whitespace-nowrap w-[100px] overflow-hidden text-ellipsis'>{ensName ? `${ensName} (${address})` : address}</div>}
      {/* <button onClick={() => disconnect()}>Disconnect</button> */}
    </div>
  )
}

export default Idendity
