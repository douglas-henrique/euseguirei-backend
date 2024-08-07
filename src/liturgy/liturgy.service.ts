import { CreateLiturgyDto } from './dto/create-liturgy.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon'
import { load } from 'cheerio'
import axios from 'axios'

const LITURGY_URL = process.env.LITURGY_URL;

@Injectable()
export class LiturgyService {
  constructor(private prisma: PrismaService) { }

  private readonly logger = new Logger(LiturgyService.name);

  async create(createLiturgyDto: CreateLiturgyDto) {
    try {
      await this.prisma.liturgy.create({
        data: createLiturgyDto
      })
      this.logger.debug('Liturgy created');
    } catch (error) {
      this.logger.debug('Error on create Liturgy');
      this.logger.debug(`Error => ${error}`);
    }
  }

  @Cron('0 01 00 * * 1-6')
  async handleCron() {
    this.logger.debug('Running Liturgy Job');
    this.logger.debug('Getting today liturgy in DB');
    const liturgyToday = await this.findTodayLiturgy()

    if (liturgyToday.length === 0) {
      this.logger.debug('Today liturgy list is empty');
      this.logger.debug('Running Liturgy web scrapper');

      try {
        const { data } = await axios.get(LITURGY_URL);
        const $ = load(data);

        const divsId = ['#liturgia-1', '#liturgia-2', '#liturgia-4']
        const hashMap = new Map()
        
        for (let [index, value] of divsId.entries()) {
          const divData = $(value).find('p').slice(1)
          hashMap.set(`firstReadingHTML${index + 1}`, divData.map((i, el) => $(el).html()).get().join('\n'))
          hashMap.set(`firstReadingText${index + 1}`, divData.map((i, el) => $(el).text()).get().join('\n'))
        }

        const liturgyCreate: CreateLiturgyDto = {
          firstReadingHTML: hashMap.get(`firstReadingHTML1`),
          psalmHTML: hashMap.get(`firstReadingHTML2`),
          gospelHTML: hashMap.get(`firstReadingHTML3`),
          firstReading: hashMap.get(`firstReadingText1`),
          psalm: hashMap.get(`firstReadingText2`),
          gospel: hashMap.get(`firstReadingText3`)
        }

        this.create(liturgyCreate)
        this.logger.debug('Creating Liturgy in DB');
      } catch (error) {
        console.error('Error while running scrapper', error);
      }

      return;
    }
    this.logger.debug('Liturgy already filled');
  }

  async findAll() {
    return this.prisma.liturgy.findMany()
  }

  async findTodayLiturgy() {
    const today = DateTime.now()
    const start = today.startOf('day').toJSDate();
    const end = today.endOf('day').toJSDate();
    return this.prisma.liturgy.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      }
    })
  }
}
