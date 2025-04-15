import Image from "next/image"
import MintButton from "../components/mint-button"
import Words from '../components/words'
import ImageCard from "@/components/ui/image-card"

export default function Mint() {
  return (
    <div className='flex flex-col items-center'>
      <Words />
      <div className='flex w-full justify-center mt-[100px] px-4'>
        <div className="relative flex flex-col items-center w-full max-w-[500px]">
          <div 
            className="relative w-full aspect-square"
            // style={{
            //   boxShadow: '0px 3px 34px -10px rgba(0, 0, 0, 0.2)'
            // }}
          >
            <ImageCard 
              imageUrl={`/api/image?tokenId=0&charLimit=100`}
              className='w-full h-full'
              caption='Disk Token'
            />
          </div>

          <MintButton />
        </div>
      </div>
    </div>
  )
}

