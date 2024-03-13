import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { UserRoles } from '../entities/user.entity';

@ApiSchema({ name: 'CreateUser' })
export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joao@domain.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Regras de permissão do usuário',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsIn(['admin', 'user'])
  roles: UserRoles;
}
