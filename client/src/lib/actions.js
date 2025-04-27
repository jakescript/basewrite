'use server'
import prisma from './prisma.js'

export const createContribution = async (contribution) => {
  try {
    console.log('creating contribution: ', JSON.stringify(contribution, null, 2))
    const res = await prisma.contribution.create({
      data: contribution
    })

    return res
  } catch (e) {
    console.log(e)
  }
}

export const getStory = async (id) => {
  try {
    const res = await prisma.contribution.findMany({
      where: {
        storyId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res
  } catch (e) {
    console.log(e)
  }
}
