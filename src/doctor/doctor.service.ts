import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { QueryDoctorsDto } from './dto/query-doctors.dto';
import { AppointmentStatus } from 'src/lib/enums/appointment-status.enum';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(queryDto: QueryDoctorsDto) {
    const { page = '1', limit = '10', specialization } = queryDto;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .skip(skip)
      .take(parseInt(limit));

    if (specialization) {
      queryBuilder.where('doctor.specialization ILIKE :specialization', {
        specialization: `%${specialization}%`,
      });
    }

    const [doctors, total] = await queryBuilder.getManyAndCount();

    return {
      data: doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.user.name,
        specialization: doctor.specialization,
        availableFrom: doctor.availableFrom,
        availableTo: doctor.availableTo,
        slotDuration: doctor.slotDuration,
      })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async getAvailableSlots(doctorId: string, date: string) {
    const doctor = await this.findById(doctorId);
    
    // Get all booked appointments for the given date
    const bookedAppointments = await this.appointmentRepository.find({
      where: {
        doctorId,
        status: AppointmentStatus.BOOKED,
      },
    });

    const bookedSlots = bookedAppointments
      .filter(appointment => {
        const appointmentDate = appointment.startTime.toISOString().split('T')[0];
        return appointmentDate === date;
      })
      .map(appointment => {
        const time = appointment.startTime.toTimeString().slice(0, 5);
        return time;
      });

    // Generate available slots
    const availableSlots = this.generateTimeSlots(
      doctor.availableFrom,
      doctor.availableTo,
      doctor.slotDuration,
      bookedSlots,
    );

    return {
      doctorId,
      date,
      availableSlots,
    };
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    slotDuration: number,
    bookedSlots: string[],
  ): string[] {
    const slots: string[] = [];
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    for (let current = start; current < end; current += slotDuration) {
      const timeSlot = this.minutesToTime(current);
      if (!bookedSlots.includes(timeSlot)) {
        slots.push(timeSlot);
      }
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}