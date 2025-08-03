import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), DoctorModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}