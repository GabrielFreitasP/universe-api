import { IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsStrongPassword()
  password: string;

  static fromCreateDto({ name, email, password }: CreateUserDto): User {
    return new User({ name, email, password });
  }
}
