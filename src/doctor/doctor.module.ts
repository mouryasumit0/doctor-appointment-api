import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Appointment])],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}