import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../security/current-user.decorator";
import { JwtAuthGuard } from "../security/jwt-auth.guard";
import { DashboardService } from "../services/dashboard.service";

@UseGuards(JwtAuthGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  get(@CurrentUser() user: { tenantId: string }) {
    return this.dashboardService.summary(user.tenantId);
  }
}
