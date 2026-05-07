import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { SprintsService } from './sprints.service'
import { CreateSprintDto } from './dto/create-sprint.dto'
import { UpdateSprintDto } from './dto/update-sprint.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Sprints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprints: SprintsService) {}

  @Post()
  @ApiOperation({ summary: 'Create sprint' })
  create(@Body() dto: CreateSprintDto) {
    return this.sprints.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get sprints by project' })
  findByProject(@Query('projectId') projectId: string) {
    return this.sprints.findByProject(projectId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sprint by ID' })
  findOne(@Param('id') id: string) {
    return this.sprints.findOne(id)
  }

  @Get(':id/burndown')
  @ApiOperation({ summary: 'Get burndown data for sprint' })
  burndown(@Param('id') id: string) {
    return this.sprints.getBurndown(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update sprint' })
  update(@Param('id') id: string, @Body() dto: UpdateSprintDto) {
    return this.sprints.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sprint' })
  remove(@Param('id') id: string) {
    return this.sprints.remove(id)
  }
}
