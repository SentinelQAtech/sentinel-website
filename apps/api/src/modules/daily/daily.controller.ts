import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { DailyService } from './daily.service'
import { CreateDailyMeetingDto } from './dto/create-daily-meeting.dto'

@ApiTags('Daily')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('daily')
export class DailyController {
  constructor(private readonly daily: DailyService) {}

  @Get('meetings')
  @ApiOperation({ summary: 'List Daily meetings for the current workspace' })
  listMeetings(@Query('date') date: string | undefined, @Request() req: any) {
    return this.daily.listMeetings(req.user, date)
  }

  @Post('meetings')
  @ApiOperation({ summary: 'Create a Daily meeting' })
  createMeeting(@Body() dto: CreateDailyMeetingDto, @Request() req: any) {
    return this.daily.createMeeting(dto, req.user)
  }

  @Delete('meetings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Daily meeting' })
  deleteMeeting(@Param('id') id: string, @Request() req: any) {
    return this.daily.deleteMeeting(id, req.user)
  }
}
