import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),DatabaseModule, AuthModule, UserModule, DoctorModule, AppointmentModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
