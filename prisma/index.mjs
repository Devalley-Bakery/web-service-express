import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
console.log(`Banco de dados sendo usado: ${process.env.DATABASE_URL}`);
export default prisma