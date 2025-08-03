import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DoctorService } from '../doctor/doctor.service';
import { AppointmentStatus } from 'src/lib/enums/appointment-status.enum';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorService: DoctorService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const { doctorId, date, time } = createAppointmentDto;

    // Validate doctor exists
    const doctor = await this.doctorService.findById(doctorId);

    // Validate time slot is within doctor's availability
    const timeMinutes = this.timeToMinutes(time);
    const availableFromMinutes = this.timeToMinutes(doctor.availableFrom);
    const availableToMinutes = this.timeToMinutes(doctor.availableTo);

    if (timeMinutes < availableFromMinutes || timeMinutes >= availableToMinutes) {
      throw new BadRequestException('Selected time is outside doctor availability');
    }

    // Create start and end times
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + doctor.slotDuration * 60000);

    // Check for conflicts
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId,
        startTime,
        status: AppointmentStatus.BOOKED,
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Slot already booked for this doctor');
    }

    // Create appointment
    const appointment = this.appointmentRepository.create({
      doctorId,
      userId,
      startTime,
      endTime,
      status: AppointmentStatus.BOOKED,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    return {
      id: savedAppointment.id,
      doctorId: savedAppointment.doctorId,
      startTime: savedAppointment.startTime,
      endTime: savedAppointment.endTime,
      status: savedAppointment.status,
    };
  }

  async findMyAppointments(userId: string) {
    const appointments = await this.appointmentRepository.find({
      where: { userId },
      relations: ['doctor', 'doctor.user'],
      order: { startTime: 'ASC' },
    });

    return appointments.map(appointment => ({
      id: appointment.id,
      doctorName: appointment.doctor.user.name,
      specialization: appointment.doctor.specialization,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
    }));
  }

  async findDoctorAppointments(doctorId: string) {
    const appointments = await this.appointmentRepository.find({
      where: { doctorId },
      relations: ['patient'],
      order: { startTime: 'ASC' },
    });

    return appointments.map(appointment => ({
      id: appointment.id,
      patientName: appointment.patient.name,
      patientEmail: appointment.patient.email,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
    }));
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}