import Image from "next/image"

export default function Mint() {
  return (
    <div className='px-[400px] flex gap-[50px] mt-[100px] w-full @max-md:flex-col'>
      <div className='flex-1 flex flex-col gap-[20px]'>
        <h1 style={{ fontFamily: `'c64', sans-serif`, fontSize: 32 }}>BaseWrite Disk</h1>
        <p style={{ fontWeight: 400, fontSize: 22 }}>
          BaseWrite Disks are on-chain storage devices for your words.
          Each NFT grants you a character limit, letting you contribute
          to collaborative stories that live forever on the blockchain.
        </p>

        <div className='flex-1'>
          <button
            className='mt-[20px] hover:cursor-pointer text-black bg-white hover:bg-black hover:text-white'
            style={{
              borderTopWidth: 3,
              borderLeftWidth: 3,
              borderRightWidth: 3,
              borderBottomWidth: 7,
              borderColor: 'black',
              boxSizing: 'border-box',
              fontWeight: 800,
              padding: '6px 25px'
            }}
          >
            mint to write
          </button>
        </div>
      </div>

      <div className='flex flex-col'>
        <div>
          <Image 
            src={`/api/image?tokenId=${1}&charLimit=${100}&level=${1}`}
            height={500}
            width={500}
            alt='Disk NFT'
            style={{
              borderWidth: 3,
              borderColor: 'black',
            }}
          />
        </div>
      </div>
    </div>
  )
}
