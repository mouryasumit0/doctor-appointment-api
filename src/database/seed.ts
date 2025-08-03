import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../lib/enums/role.enum';
import 'dotenv/config';
import { Appointment } from 'src/appointment/entities/appointment.entity';

console.log('DB_PASSWORD:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD);

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Doctor, Appointment],
  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Starting database seed...');

    const userRepository = dataSource.getRepository(User);
    const doctorRepository = dataSource.getRepository(Doctor);

    // Create patient user
    const patientUser = await userRepository.save({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: Role.PATIENT,
    });

    console.log('Created patient user:', { email: patientUser.email });

    // Create doctor users and their profiles
    const doctorData = [
      {
        name: 'Dr. John Smith',
        email: 'john.smith@hospital.com',
        specialization: 'Dermatologist',
        availableFrom: '09:00',
        availableTo: '17:00',
        slotDuration: 30,
      },
      {
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@hospital.com',
        specialization: 'Cardiologist',
        availableFrom: '08:00',
        availableTo: '16:00',
        slotDuration: 45,
      },
      {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@hospital.com',
        specialization: 'Orthopedic',
        availableFrom: '10:00',
        availableTo: '18:00',
        slotDuration: 30,
      },
      {
        name: 'Dr. Emily Davis',
        email: 'emily.davis@hospital.com',
        specialization: 'Pediatrician',
        availableFrom: '09:30',
        availableTo: '17:30',
        slotDuration: 25,
      },
    ];

    for (const doctorInfo of doctorData) {
      // Create doctor user
      const doctorUser = await userRepository.save({
        name: doctorInfo.name,
        email: doctorInfo.email,
        passwordHash: await bcrypt.hash('password123', 10),
        role: Role.DOCTOR,
      });

      // Create doctor profile
      await doctorRepository.save({
        userId: doctorUser.id,
        specialization: doctorInfo.specialization,
        availableFrom: doctorInfo.availableFrom,
        availableTo: doctorInfo.availableTo,
        slotDuration: doctorInfo.slotDuration,
      });

      console.log('Created doctor:', { 
        name: doctorInfo.name, 
        specialization: doctorInfo.specialization 
      });
    }

    console.log('Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Patient: alice@example.com / password123');
    console.log('Doctor: john.smith@hospital.com / password123');

  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();