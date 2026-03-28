import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClinicalRecordsModule } from './modules/clinical-records/clinical-records.module';
import { ClinicalEvolutionsModule } from './modules/clinical-evolutions/clinical-evolutions.module';
import { TreatmentsModule } from './modules/treatments/treatments.module';
import { TreatmentPlansModule } from './modules/treatment-plans/treatment-plans.module';
import { PerformedProceduresModule } from './modules/performed-procedures/performed-procedures.module';
import { ClinicalFilesModule } from './modules/clinical-files/clinical-files.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Only for development
      }),
    }),
    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    ClinicalRecordsModule,
    ClinicalEvolutionsModule,
    TreatmentsModule,
    TreatmentPlansModule,
    PerformedProceduresModule,
    ClinicalFilesModule,
    DashboardModule,
  ],
})
export class AppModule {}
