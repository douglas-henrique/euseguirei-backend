import { PrismaClient } from '@prisma/client'
import { DateTime } from 'luxon'
import { getLiturgyInformations } from '../utils/liturgyScrapper'

const prisma = new PrismaClient()

async function findTodayLiturgy() {
  const today = DateTime.now()
  const start = today.startOf('day').toJSDate();
  const end = today.endOf('day').toJSDate();
  return prisma.liturgy.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    }
  })
}

async function main() {
  const liturgyToday = await findTodayLiturgy()
  if (liturgyToday.length === 0) {
    try {
      const liturgyCreate = await getLiturgyInformations()
      try {
        await prisma.liturgy.create({
          data: liturgyCreate
        })
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.error('Error while running scrapper', error);
    }

    return;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })