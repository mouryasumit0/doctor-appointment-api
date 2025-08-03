import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSlotsDto {
  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  date: string;
}