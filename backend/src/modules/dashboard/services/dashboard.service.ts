import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { TreatmentPlan } from '../../treatment-plans/entities/treatment-plan.entity';
import { AppointmentStatus } from '../../../common/enums/appointment-status.enum';
import { TreatmentPlanStatus } from '../../../common/enums/treatment-plan-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(TreatmentPlan)
    private readonly treatmentPlanRepository: Repository<TreatmentPlan>,
  ) {}

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      todayAppointments,
      attendedToday,
      newPatients,
      treatmentsInProgress,
      treatmentsCompleted,
      cancelledLast30Days,
    ] = await Promise.all([
      this.appointmentRepository.count({
        where: {
          dateTime: Between(today, tomorrow),
        },
      }),
      this.appointmentRepository.count({
        where: {
          dateTime: Between(today, tomorrow),
          status: AppointmentStatus.ATTENDED,
        },
      }),
      this.patientRepository.count({
        where: {
          createdAt: MoreThanOrEqual(thirtyDaysAgo),
        },
      }),
      this.treatmentPlanRepository.count({
        where: { status: TreatmentPlanStatus.IN_PROGRESS },
      }),
      this.treatmentPlanRepository.count({
        where: { status: TreatmentPlanStatus.COMPLETED },
      }),
      this.appointmentRepository.count({
        where: {
          status: AppointmentStatus.CANCELLED,
          createdAt: MoreThanOrEqual(thirtyDaysAgo),
        },
      }),
    ]);

    return {
      data: {
        todayAppointments,
        attendedToday,
        newPatients,
        treatmentsInProgress,
        treatmentsCompleted,
        cancelledLast30Days,
      },
    };
  }

  async getAppointmentsByStatus() {
    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select('appointment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('appointment.status')
      .getRawMany();

    return { data: result };
  }

  async getDoctorWorkload() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.doctor', 'doctor')
      .select('doctor.id', 'doctorId')
      .addSelect("CONCAT(doctor.first_name, ' ', doctor.last_name)", 'doctorName')
      .addSelect('COUNT(*)', 'appointmentCount')
      .where('appointment.date_time >= :today', { today })
      .andWhere('appointment.date_time < :tomorrow', { tomorrow })
      .andWhere('appointment.status != :cancelled', {
        cancelled: AppointmentStatus.CANCELLED,
      })
      .groupBy('doctor.id')
      .addGroupBy('doctor.first_name')
      .addGroupBy('doctor.last_name')
      .getRawMany();

    return { data: result };
  }

  async getTreatmentsSummary() {
    const result = await this.treatmentPlanRepository
      .createQueryBuilder('plan')
      .select('plan.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('plan.status')
      .getRawMany();

    return { data: result };
  }

  async getRecentActivity() {
    const recentAppointments = await this.appointmentRepository.find({
      relations: ['patient', 'doctor'],
      order: { createdAt: 'DESC' },
      take: 20,
    });

    return {
      data: recentAppointments.map((appt) => ({
        id: appt.id,
        patient: appt.patient
          ? `${appt.patient.firstName} ${appt.patient.lastName}`
          : 'N/A',
        doctor: appt.doctor
          ? `${appt.doctor.firstName} ${appt.doctor.lastName}`
          : 'N/A',
        status: appt.status,
        dateTime: appt.dateTime,
        createdAt: appt.createdAt,
      })),
    };
  }
}
