import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TreatmentPlansService } from '../services/treatment-plans.service';
import { CreateTreatmentPlanDto } from '../dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from '../dto/update-treatment-plan.dto';
import { CreatePlanItemDto } from '../dto/create-plan-item.dto';
import { UpdatePlanItemDto } from '../dto/update-plan-item.dto';
import { FilterTreatmentPlanDto } from '../dto/filter-treatment-plan.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@ApiTags('Treatment Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('treatment-plans')
export class TreatmentPlansController {
  constructor(private readonly plansService: TreatmentPlansService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create treatment plan' })
  create(@Body() createDto: CreateTreatmentPlanDto) {
    return this.plansService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List treatment plans (paginated, filtros opcionales)' })
  findAll(@Query() filterDto: FilterTreatmentPlanDto) {
    return this.plansService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get treatment plan with items' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update treatment plan' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTreatmentPlanDto,
  ) {
    return this.plansService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Delete treatment plan' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.plansService.remove(id);
  }

  @Post(':id/items')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Add item to treatment plan' })
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createItemDto: CreatePlanItemDto,
  ) {
    return this.plansService.addItem(id, createItemDto);
  }

  @Patch(':id/items/:itemId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update treatment plan item' })
  updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateItemDto: UpdatePlanItemDto,
  ) {
    return this.plansService.updateItem(id, itemId, updateItemDto);
  }

  @Delete(':id/items/:itemId')
  @Roles(Role.DOCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Remove item from treatment plan' })
  removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.plansService.removeItem(id, itemId);
  }
}
