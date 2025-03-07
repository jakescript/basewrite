import Image from "next/image"

export default function Mint() {
  return (
    <div className='flex justify-center align-center'>
      <div className='flex flex-col gap-[20px] mt-[100px] w-full px-[1rem] sm:px-[3rem] md:flex-row! max-w-[1280px]'>
        <div className='flex flex-1 flex-col gap-[20px]'>
          <div className='flex flex-col gap-[15px]'>
            <h1 style={{ fontFamily: `'c64', sans-serif`, fontSize: 32 }}>BaseWrite Disk</h1>
            <p className='text-2xl font-bold max-w-[700px]'>
              BaseWrite Disks are on-chain storage devices for your words.
              Each NFT grants you a character limit, letting you contribute
              to collaborative stories that live forever on the blockchain.
            </p>
          </div>

          <div className=''>
            <button
              className='mt-[20px] hover:cursor-pointer text-black bg-white hover:bg-black hover:text-white'
              style={{
                fontSize: 20,
                borderTopWidth: 3,
                borderLeftWidth: 3,
                borderRightWidth: 3,
                borderBottomWidth: 7,
                borderColor: 'black',
                boxSizing: 'border-box',
                fontWeight: 800,
                padding: '6px 25px',
              }}
            >
              mint to write
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 sm:justify-center md:justify-end">
          {/* Image Stack */}
          <div className="relative w-[500px] h-[500px]">
            <Image 
              src={`/api/image?tokenId=1&charLimit=100&level=1`}
              height={500}
              width={500}
              alt="Disk NFT"
              className="absolute top-0 left-0 border border-black z-10"
            />
            <div 
              className="absolute w-[500px] h-[500px] bg-[#f5f5f5] top-[10px] left-[10px] z-0"
            ></div>
            <div 
              className="absolute w-[500px] h-[500px] bg-[#ebebeb] top-[20px] left-[20px] z-[-1]"
            ></div>
            <div 
              className="absolute w-[500px] h-[500px] bg-[#e0e0e0] top-[30px] left-[30px] z-[-2]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
