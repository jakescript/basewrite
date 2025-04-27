import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// const globalForPrisma = { 
//     prisma: PrismaClient
// }
//
const prisma = new PrismaClient().$extends(withAccelerate())
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
