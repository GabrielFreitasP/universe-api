import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateUser' })
export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joão@domain.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123' })
  @IsNotEmpty()
  password: string;
}
