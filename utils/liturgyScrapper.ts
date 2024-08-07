import axios from 'axios'
const LITURGY_URL = process.env.LITURGY_URL;
import { load } from 'cheerio'
import { CreateLiturgyDto } from '../src/liturgy/dto/create-liturgy.dto'

const getLiturgyInformations = async (): Promise<CreateLiturgyDto> => {
  const { data } = await axios.get(LITURGY_URL ?? '');
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

  return liturgyCreate
}

export { getLiturgyInformations }
