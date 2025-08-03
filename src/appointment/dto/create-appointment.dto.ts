import { IsUUID, IsDateString, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'doctor-uuid-here' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:30' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format',
  })
  time: string;
}