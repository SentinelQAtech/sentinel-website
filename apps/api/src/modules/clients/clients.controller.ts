import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a client' })
  create(@Body() dto: CreateClientDto, @Request() req: any) {
    return this.clients.create(dto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: 'List workspace clients' })
  findAll(@Request() req: any, @Query('activeOnly') activeOnly?: string) {
    return this.clients.findAll(req.user.id, activeOnly === 'true')
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.clients.findOne(id, req.user.id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto, @Request() req: any) {
    return this.clients.update(id, dto, req.user.id)
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Finish client' })
  finish(@Param('id') id: string, @Request() req: any) {
    return this.clients.finish(id, req.user.id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete client' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.clients.remove(id, req.user.id)
  }
}
