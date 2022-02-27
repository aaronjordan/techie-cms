import { Module } from '@nestjs/common';
import { ActController } from './act.controller';
import { ActService } from './act.service';

@Module({
  controllers: [ActController],
  providers: [ActService]
})
export class ActModule {}
