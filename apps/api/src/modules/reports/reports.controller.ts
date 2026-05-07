import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  dashboardStats(@Request() req: any) {
    return this.reports.getDashboardStats(req.user.id)
  }

  @Get('bug-trend')
  @ApiOperation({ summary: 'Get bug trend over last N days' })
  bugTrend(@Query('days') days?: number) {
    return this.reports.getBugTrend(days ? Number(days) : 30)
  }

  @Get('sprint-velocity')
  @ApiOperation({ summary: 'Get sprint velocity for a project' })
  sprintVelocity(@Query('projectId') projectId: string, @Query('limit') limit?: number) {
    return this.reports.getSprintVelocity(projectId, limit ? Number(limit) : 5)
  }

  @Get('team-productivity')
  @ApiOperation({ summary: 'Get team productivity for a project' })
  teamProductivity(@Query('projectId') projectId: string) {
    return this.reports.getTeamProductivity(projectId)
  }
}
