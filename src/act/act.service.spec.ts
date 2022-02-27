import { Test, TestingModule } from '@nestjs/testing';
import { ActService } from './act.service';

describe('ActService', () => {
  let service: ActService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActService],
    }).compile();

    service = module.get<ActService>(ActService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
