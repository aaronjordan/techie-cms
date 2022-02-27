import { Test, TestingModule } from '@nestjs/testing';
import { ActController } from './act.controller';

describe('ActController', () => {
  let controller: ActController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActController],
    }).compile();

    controller = module.get<ActController>(ActController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
