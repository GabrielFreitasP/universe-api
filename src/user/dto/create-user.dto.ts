import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthRolesEnum } from 'src/auth/enums/auth-roles.enum';
import { IsEnumCombination } from 'src/commons/decorators/is-enum-combination.decorator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

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
    example: AuthRolesEnum.ADMIN,
  })
  @IsNotEmpty()
  @IsEnumCombination(AuthRolesEnum)
  roles: string;
}
