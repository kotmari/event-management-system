import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

//не вийшло підключити 


const prisma = new PrismaClient();

async function main() {
   const defaultTags =  ['Technology', 'Art', 'Business', 'Music', 'Health', 'Leisure'];
   console.log("seeding tags")

   for(const tagName of defaultTags) {
      await prisma.tag.upsert({
         where: {name: tagName},
         update: {},
         create: {name: tagName}
      })
   }
   console.log("seeding finished")
}

main().catch((e) => {
   console.error(e)
   process.exit(1)
}).finally(async()=> {
   await prisma.$disconnect()
})
