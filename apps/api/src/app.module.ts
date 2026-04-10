import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./controllers/app.controller";
import { AppointmentsController } from "./controllers/appointments.controller";
import { AuthController } from "./controllers/auth.controller";
import { ClinicsController } from "./controllers/clinics.controller";
import { ClinicalNotesController } from "./controllers/clinical-notes.controller";
import { DashboardController } from "./controllers/dashboard.controller";
import { PatientsController } from "./controllers/patients.controller";
import { PaymentsController } from "./controllers/payments.controller";
import { TreatmentsController } from "./controllers/treatments.controller";
import { UsersController } from "./controllers/users.controller";
import { JwtAuthGuard } from "./security/jwt-auth.guard";
import { JwtStrategy } from "./security/jwt.strategy";
import { RolesGuard } from "./security/roles.guard";
import { AppService } from "./services/app.service";
import { AppointmentsService } from "./services/appointments.service";
import { AuditService } from "./services/audit.service";
import { AuthService } from "./services/auth.service";
import { BillingService } from "./services/billing.service";
import { ClinicsService } from "./services/clinics.service";
import { ClinicalNotesService } from "./services/clinical-notes.service";
import { DashboardService } from "./services/dashboard.service";
import { DatabaseService } from "./services/database.service";
import { IntegrationService } from "./services/integration.service";
import { PatientsService } from "./services/patients.service";
import { PaymentsService } from "./services/payments.service";
import { TreatmentsService } from "./services/treatments.service";
import { UsersService } from "./services/users.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env", "apps/api/.env"] }),
    JwtModule.register({}),
  ],
  controllers: [
    AppController,
    AuthController,
    ClinicsController,
    UsersController,
    PatientsController,
    AppointmentsController,
    ClinicalNotesController,
    TreatmentsController,
    PaymentsController,
    DashboardController,
  ],
  providers: [
    DatabaseService,
    AppService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    AuditService,
    ClinicsService,
    UsersService,
    PatientsService,
    AppointmentsService,
    ClinicalNotesService,
    TreatmentsService,
    PaymentsService,
    DashboardService,
    IntegrationService,
    BillingService,
  ],
})
export class AppModule {}
