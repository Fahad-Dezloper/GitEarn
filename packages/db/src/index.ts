import { PrismaClient } from '@prisma/client'
import dotenv from "dotenv"
dotenv.config()

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// 开发环境
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma