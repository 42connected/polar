import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { ReportsSortDto } from '../dto/reports/reports-sort.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { ReportsService } from './service/reports.service';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':reportId')
  async getReport(@Param('reportId') reportId: string) {
    return await this.reportsService.getReport(reportId);
  }

  @Post()
  async postReport(@Body() req: any) {
    return await this.reportsService.postReport(req);
  }

  @Put()
  async putReport(@Body() req: any) {
    return await this.putReport(req);
  }

  @Get()
  @Roles('')
  // FIXME: add to "bocal"
  // @UseGuards(JwtGuard, RolesGuard)
  async getAllReport() {
    console.log('here');
    return await this.reportsService.getAllReport();
  }

  @Post('/sort')
  async sortReport(@Body() reportsSortDto: ReportsSortDto) {
    return await this.reportsService.sortReport(reportsSortDto);
  }
}
