import { Test, TestingModule } from '@nestjs/testing';
import { LiturgyController } from './liturgy.controller';
import { LiturgyService } from './liturgy.service';

describe('LiturgyController', () => {
  let controller: LiturgyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiturgyController],
      providers: [LiturgyService],
    }).compile();

    controller = module.get<LiturgyController>(LiturgyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
