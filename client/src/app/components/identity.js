'use client'
import { useEffect, useMemo } from 'react'
import { 
  useAccount,
  useEnsAvatar,
  useEnsName,
  useReadContract,
} from 'wagmi'
import WalletButton from './wallet-button'
import Image from 'next/image'
import disk from '../util/Disk.json'
import { useAppContext } from './context'
import { createAvatar } from '@dicebear/core';
import { thumbs, pixelArtNeutral, pixelArt, notionistsNeutral, glass } from '@dicebear/collection';

const Idendity = () => {
  const { setTokenIds, client } = useAppContext()

  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  const avatar = useMemo(() => {
      return createAvatar(glass, {
        seed: address,
        size: 50,
        radius: 20
      }).toDataUri();
    }, [address]); 

  const { data: balance } = useReadContract({
    address: '0xC3D5EB67D166bCb2a8680d20ad3E5E3b9e19b29B',
    abi: disk?.abi,
    functionName: 'balanceOf',
    args: [ address ],
    query: {
      enabled: !!address
    }
  })

  const getTokenIds = async (address, balance) => {
    try {
      const promises = []

      for (let i = 0; i < balance; i++) {
        promises.push(client.readContract({
          address: '0xC3D5EB67D166bCb2a8680d20ad3E5E3b9e19b29B',
          abi: disk?.abi,
          functionName: 'tokenOfOwnerByIndex',
          args: [ address, i ],
        }))
      }

      const tokenIds = (await Promise.all(promises))?.map(id => Number(id))
      setTokenIds(tokenIds)
    } catch (e) {
      console.log(
        'getTokenIds',
        { error: e }
      )
    }
  }

  useEffect(() => {
    if (!address || !balance) {
      return
    }

    getTokenIds(address, balance)
  }, [address, balance, getTokenIds])


  if (!address) {
    return <WalletButton />
  }

  return (
    <div className='flex gap-[20px] items-center'>
      {ensAvatar && <Image alt="ENS Avatar" src={ensAvatar} />}
      {address && <div className='whitespace-nowrap w-[100px] overflow-hidden text-ellipsis'>{ensName ? `${ensName} (${address})` : address}</div>}
      <Image src={avatar} alt='avatar' width={50} height={50} />
      {/* <button onClick={() => disconnect()}>Disconnect</button> */}
    </div>
  )
}

export default Idendity
