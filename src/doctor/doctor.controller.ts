import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { QueryDoctorsDto } from './dto/query-doctors.dto';
import { GetSlotsDto } from './dto/get-slots.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all doctors with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of doctors retrieved successfully' })
  async findAll(@Query() queryDto: QueryDoctorsDto) {
    return await this.doctorService.findAll(queryDto);
  }

  @Get(':id/slots')
  @ApiOperation({ summary: 'Get available time slots for a doctor' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiQuery({ name: 'date', example: '2025-01-15', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async getAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return await this.doctorService.getAvailableSlots(id, date);
  }
}