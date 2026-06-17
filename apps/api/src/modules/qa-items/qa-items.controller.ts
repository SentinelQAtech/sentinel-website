import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { QAItemsService } from './qa-items.service'
import { CreateQAItemDto, ImportQAItemsDto } from './dto/create-qa-item.dto'
import {
  RecordQAItemResolutionDto,
  SendQAItemToDailyDto,
  UpdateQAItemDailyStatusDto,
  UpdateQAItemDto,
  UpdateQAItemWorkflowStateDto,
} from './dto/update-qa-item.dto'

@ApiTags('QA Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('qa-items')
export class QAItemsController {
  constructor(private readonly qaItems: QAItemsService) {}

  @Get()
  @ApiOperation({ summary: 'List QA items for the current workspace' })
  list(@Query() query: Record<string, string>, @Request() req: any) {
    return this.qaItems.list(req.user, query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get QA item by ID' })
  get(@Param('id') id: string, @Request() req: any) {
    return this.qaItems.get(id, req.user)
  }

  @Post()
  @ApiOperation({ summary: 'Create or update a QA item' })
  create(@Body() dto: CreateQAItemDto, @Request() req: any) {
    return this.qaItems.create(dto, req.user)
  }

  @Post('import')
  @ApiOperation({ summary: 'Import QA items in bulk' })
  import(@Body() dto: ImportQAItemsDto, @Request() req: any) {
    return this.qaItems.import(dto, req.user)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update QA item' })
  update(@Param('id') id: string, @Body() dto: UpdateQAItemDto, @Request() req: any) {
    return this.qaItems.update(id, dto, req.user)
  }

  @Post(':id/send-to-daily')
  @ApiOperation({ summary: 'Send QA item to Daily' })
  sendToDaily(@Param('id') id: string, @Body() dto: SendQAItemToDailyDto, @Request() req: any) {
    return this.qaItems.sendToDaily(id, dto, req.user)
  }

  @Patch(':id/workflow-state')
  @ApiOperation({ summary: 'Update QA item workflow state' })
  updateWorkflowState(@Param('id') id: string, @Body() dto: UpdateQAItemWorkflowStateDto, @Request() req: any) {
    return this.qaItems.updateWorkflowState(id, dto, req.user)
  }

  @Patch(':id/daily-status')
  @ApiOperation({ summary: 'Update QA item Daily status' })
  updateDailyStatus(@Param('id') id: string, @Body() dto: UpdateQAItemDailyStatusDto, @Request() req: any) {
    return this.qaItems.updateDailyStatus(id, dto, req.user)
  }

  @Patch(':id/daily-order/:direction')
  @ApiOperation({ summary: 'Move QA item in Daily order' })
  moveDailyItem(@Param('id') id: string, @Param('direction') direction: 'up' | 'down', @Request() req: any) {
    return this.qaItems.moveDailyItem(id, direction, req.user)
  }

  @Post(':id/resolution')
  @ApiOperation({ summary: 'Record QA item resolution/evidence' })
  recordResolution(@Param('id') id: string, @Body() dto: RecordQAItemResolutionDto, @Request() req: any) {
    return this.qaItems.recordResolution(id, dto, req.user)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Archive QA item' })
  archive(@Param('id') id: string, @Request() req: any) {
    return this.qaItems.archive(id, req.user)
  }
}
