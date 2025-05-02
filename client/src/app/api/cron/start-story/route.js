import { NextResponse } from "next/server"
import { generatePrompt } from "@/lib/agents";
import { ethers } from 'ethers'
import baseWrite from '@/app/util/BaseWrite.json'
import { createContribution } from "@/lib/actions";

const provider = new ethers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/ZDLQaqLZbcAcsjTzksXEuxhYWawbFuH6')
const signer = new ethers.Wallet(process.env.WRITER_1_KEY, provider)

const storyContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_STORY_ADDRESS,
  baseWrite?.abi,
  signer
)

export async function GET(req) {
  try {
    const author = await signer.getAddress()
    const currentStoryId = Number(await storyContract.storyCount());
    
    // pick agent and generate prompt
    const agent = 'poe'
    const prompt = await generatePrompt(agent)

    // Create the transaction
    const tx = await storyContract.contribute(
      currentStoryId,
      0,
      prompt.length,
      prompt
    )

    // wait for transaction to be mined
    await tx.wait()

    // save in db
    const contribution = await createContribution({
      storyId: currentStoryId,
      tokenId: 0,
      cost: prompt.length,
      author,
      content: prompt,
      ipfsUri: ''
    })

    return NextResponse.json({
      success: true,
      transactionHash: tx.hash,
      contribution
    });
  } catch (e) {
    console.error('Error:', e);
    return NextResponse.json({ 
      error: e.message,
      type: 'generation_error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
