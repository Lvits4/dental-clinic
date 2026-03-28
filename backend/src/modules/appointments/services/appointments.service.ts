import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, LessThan, MoreThan } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { FilterAppointmentDto } from '../dto/filter-appointment.dto';
import { RescheduleAppointmentDto } from '../dto/reschedule-appointment.dto';
import { AppointmentStatus } from '../../../common/enums/appointment-status.enum';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    await this.validateNoOverlap(
      createDto.doctorId,
      new Date(createDto.dateTime),
      createDto.durationMinutes || 30,
    );

    const appointment = this.appointmentRepository.create(createDto);
    return this.appointmentRepository.save(appointment);
  }

  async findAll(filterDto: FilterAppointmentDto): Promise<PaginatedResponseDto<Appointment>> {
    const { page = 1, limit = 10, doctorId, patientId, status, dateFrom, dateTo } = filterDto;
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor');

    if (doctorId) {
      query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
    }
    if (patientId) {
      query.andWhere('appointment.patient_id = :patientId', { patientId });
    }
    if (status) {
      query.andWhere('appointment.status = :status', { status });
    }
    if (dateFrom) {
      query.andWhere('appointment.date_time >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('appointment.date_time <= :dateTo', { dateTo });
    }

    query.orderBy('appointment.date_time', 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: string, updateDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (updateDto.dateTime || updateDto.durationMinutes) {
      const dateTime = updateDto.dateTime ? new Date(updateDto.dateTime) : appointment.dateTime;
      const duration = updateDto.durationMinutes || appointment.durationMinutes;
      const doctorId = updateDto.doctorId || appointment.doctorId;
      await this.validateNoOverlap(doctorId, dateTime, duration, id);
    }

    Object.assign(appointment, updateDto);
    return this.appointmentRepository.save(appointment);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async reschedule(id: string, rescheduleDto: RescheduleAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    const duration = rescheduleDto.durationMinutes || appointment.durationMinutes;

    await this.validateNoOverlap(
      appointment.doctorId,
      new Date(rescheduleDto.dateTime),
      duration,
      id,
    );

    appointment.dateTime = new Date(rescheduleDto.dateTime);
    if (rescheduleDto.durationMinutes) {
      appointment.durationMinutes = rescheduleDto.durationMinutes;
    }
    appointment.status = AppointmentStatus.SCHEDULED;
    return this.appointmentRepository.save(appointment);
  }

  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, AppointmentStatus.CANCELLED);
  }

  async getAgenda(doctorId?: string, dateFrom?: string, dateTo?: string): Promise<Appointment[]> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .where('appointment.status != :cancelled', {
        cancelled: AppointmentStatus.CANCELLED,
      });

    if (doctorId) {
      query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
    }
    if (dateFrom) {
      query.andWhere('appointment.date_time >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('appointment.date_time <= :dateTo', { dateTo });
    }

    query.orderBy('appointment.date_time', 'ASC');
    return query.getMany();
  }

  private async validateNoOverlap(
    doctorId: string,
    dateTime: Date,
    durationMinutes: number,
    excludeId?: string,
  ): Promise<void> {
    const endTime = new Date(dateTime.getTime() + durationMinutes * 60000);

    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctor_id = :doctorId', { doctorId })
      .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      })
      .andWhere(
        '(appointment.date_time < :endTime AND appointment.date_time + (appointment.duration_minutes || \' minutes\')::interval > :startTime)',
        { startTime: dateTime, endTime },
      );

    if (excludeId) {
      query.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const overlapping = await query.getCount();
    if (overlapping > 0) {
      throw new ConflictException(
        'Doctor already has an appointment in this time slot',
      );
    }
  }
}
