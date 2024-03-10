import { IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  name: string;

  @IsStrongPassword()
  password: string;
}
