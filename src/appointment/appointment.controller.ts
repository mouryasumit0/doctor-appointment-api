import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/lib/decorators/roles.decorator';
import { Role } from 'src/lib/enums/role.enum';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Roles(Role.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Book an appointment (Patient only)' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully' })
  @ApiResponse({ status: 409, description: 'Slot already booked' })
  @ApiResponse({ status: 400, description: 'Invalid time slot' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser() user: User,
  ) {
    return await this.appointmentService.create(createAppointmentDto, user.id);
  }

  @Get('me')
  @Roles(Role.PATIENT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get my appointments (Patient only)' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully' })
  async getMyAppointments(@CurrentUser() user: User) {
    return await this.appointmentService.findMyAppointments(user.id);
  }

  @Get('doctor/:doctorId')
  @Roles(Role.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get doctor appointments (Doctor only)' })
  @ApiResponse({ status: 200, description: 'Doctor appointments retrieved successfully' })
  async getDoctorAppointments(@Param('doctorId') doctorId: string) {
    return await this.appointmentService.findDoctorAppointments(doctorId);
  }
}