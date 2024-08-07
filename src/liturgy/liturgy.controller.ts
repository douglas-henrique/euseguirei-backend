import { Controller, Get, UseGuards } from '@nestjs/common';
import { LiturgyService } from './liturgy.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard'

@Controller('liturgy')
export class LiturgyController {
  constructor(private readonly liturgyService: LiturgyService) { }

  @Get('/today')
  @UseGuards(ApiKeyGuard)
  findAll() {
    return this.liturgyService.findTodayLiturgy();
  }
}
