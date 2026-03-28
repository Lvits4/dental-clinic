import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get general daily metrics' })
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('appointments-by-status')
  @ApiOperation({ summary: 'Get appointments grouped by status' })
  getAppointmentsByStatus() {
    return this.dashboardService.getAppointmentsByStatus();
  }

  @Get('doctor-workload')
  @ApiOperation({ summary: 'Get doctor workload for today' })
  getDoctorWorkload() {
    return this.dashboardService.getDoctorWorkload();
  }

  @Get('treatments-summary')
  @ApiOperation({ summary: 'Get treatments summary by status' })
  getTreatmentsSummary() {
    return this.dashboardService.getTreatmentsSummary();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity from audit logs' })
  getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}
