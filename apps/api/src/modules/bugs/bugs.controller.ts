import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, Request, HttpCode, HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { BugsService } from './bugs.service'
import { CreateBugDto } from './dto/create-bug.dto'
import { UpdateBugDto } from './dto/update-bug.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BugSeverity, BugStatus, Priority } from '@prisma/client'

@ApiTags('Bugs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bugs')
export class BugsController {
  constructor(private readonly bugs: BugsService) {}

  @Post()
  @ApiOperation({ summary: 'Report a new bug' })
  create(@Body() dto: CreateBugDto, @Request() req: any) {
    return this.bugs.create(dto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: 'List bugs with filters' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'severity',  required: false, enum: BugSeverity })
  @ApiQuery({ name: 'status',    required: false, enum: BugStatus })
  @ApiQuery({ name: 'priority',  required: false, enum: Priority })
  @ApiQuery({ name: 'search',    required: false })
  @ApiQuery({ name: 'page',      required: false })
  @ApiQuery({ name: 'limit',     required: false })
  findAll(@Query() query: any) {
    return this.bugs.findAll(query)
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get bug statistics' })
  stats(@Query('projectId') projectId?: string) {
    return this.bugs.getStats(projectId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bug by ID' })
  findOne(@Param('id') id: string) {
    return this.bugs.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bug' })
  update(@Param('id') id: string, @Body() dto: UpdateBugDto, @Request() req: any) {
    return this.bugs.update(id, dto, req.user.id)
  }

  @Post('bulk-sync')
  @ApiOperation({ summary: 'Bulk sync bugs from QA Importer' })
  bulkSync(@Body() dto: { items: any[] }, @Request() req: any) {
    return this.bugs.bulkSync(dto.items, req.user.id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete bug' })
  remove(@Param('id') id: string) {
    return this.bugs.remove(id)
  }
}
