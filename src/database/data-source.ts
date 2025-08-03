import 'dotenv/config'; // Load environment variables from .env
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { Appointment } from '../appointment/entities/appointment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Doctor, Appointment],
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'doctors_appointment_migrations',
  synchronize: false, // Always false in production
});

