import { IsEmail, IsStrongPassword, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsStrongPassword()
  password: string;
}
