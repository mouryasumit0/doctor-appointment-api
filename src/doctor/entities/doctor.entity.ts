import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.doctorProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  specialization: string;

  @Column({ type: 'time' })
  availableFrom: string;

  @Column({ type: 'time' })
  availableTo: string;

  @Column({ default: 30 })
  slotDuration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}