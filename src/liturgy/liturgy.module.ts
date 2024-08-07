import { Module } from '@nestjs/common';
import { LiturgyService } from './liturgy.service';
import { LiturgyController } from './liturgy.controller';
import { PrismaService } from 'src/prisma.service';
@Module({
  controllers: [LiturgyController],
  providers: [LiturgyService, PrismaService],
})
export class LiturgyModule {}
