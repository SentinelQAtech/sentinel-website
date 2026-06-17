import { Module } from '@nestjs/common'
import { QAItemsController } from './qa-items.controller'
import { QAItemsService } from './qa-items.service'

@Module({
  controllers: [QAItemsController],
  providers: [QAItemsService],
})
export class QAItemsModule {}
