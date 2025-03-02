import { NextResponse } from "next/server"
import { keccak256 } from 'ethers'

const generateTraits = (tokenId) => {
  const hash = keccak256(new Buffer.from(tokenId.toString()))

  /* 
  * default charLimit to 100
  * update based on current contrubtions to active stories
  */
  const charLimit = 100

  return {
    charLimit
  }
}

export async function GET(req, { params }) {
  const id = (await params).id
  const traits = generateTraits(id)

  const metadata = {
    name: `Disc #${id}`,
    description: 'NFT representing allotted character limit to contribute to collaberative stories.',
    image: `http://localhost:3000/api/image?tokenId=${id}&charLimit=${traits.charLimit}`,
    attributes: [
      {
        trait_type: 'Char Limit',
        value: traits.charLimit
      },

    ]
  }
  return NextResponse.json(metadata)
}
