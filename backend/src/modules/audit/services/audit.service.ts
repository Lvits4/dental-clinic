import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { FilterAuditDto } from '../dto/filter-audit.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    userId: string;
    action: string;
    module: string;
    entityId?: string;
    detail?: Record<string, any>;
    ipAddress?: string;
  }): Promise<AuditLog> {
    const auditLog = this.auditRepository.create(data);
    return this.auditRepository.save(auditLog);
  }

  async findAll(filterDto: FilterAuditDto): Promise<PaginatedResponseDto<AuditLog>> {
    const { page = 1, limit = 10, userId, action, module, dateFrom, dateTo } = filterDto;
    const query = this.auditRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user');

    if (userId) {
      query.andWhere('audit.user_id = :userId', { userId });
    }
    if (action) {
      query.andWhere('audit.action = :action', { action });
    }
    if (module) {
      query.andWhere('audit.module = :module', { module });
    }
    if (dateFrom) {
      query.andWhere('audit.created_at >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query.andWhere('audit.created_at <= :dateTo', { dateTo });
    }

    query.orderBy('audit.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);

    const [data, totalItems] = await query.getManyAndCount();
    return new PaginatedResponseDto(data, totalItems, page, limit);
  }

  async findOne(id: string): Promise<AuditLog> {
    const log = await this.auditRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!log) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
    return log;
  }
}
