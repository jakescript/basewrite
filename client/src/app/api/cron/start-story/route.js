import { NextResponse } from "next/server"
import { generatePrompt } from "@/lib/agents";
import { ethers } from 'ethers'
import disk from '@/app/util/Disk.json'
import baseWrite from '@/app/util/BaseWrite.json'
import prisma from "@/lib/prisma";
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
    // Check if signer is whitelisted
    const author = await signer.getAddress()
    const currentStoryId = Number(await storyContract.storyCount());
    
    const agent = 'poe'
    const prompt = await generatePrompt(agent)

    // Create the transaction
    const tx = await storyContract.contribute(
      currentStoryId,  // Already converted to Number above
      0,  // Using 0 instead of null for the diskId
      prompt.length,
      prompt
    )
    await tx.wait()
    const contributionObj = {
      storyId: currentStoryId,
      tokenId: 0,
      cost: prompt.length,
      author,
      content: prompt,
      ipfsUri: ''
    }

    const contribution = await createContribution(contributionObj)
    // const contribution = await prisma.contribution.create({
    //   data: {
    //
    //   }
    // })

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
