import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { AuthRolesEnum } from 'src/auth/enums/auth-roles.enum';
import { IsEnumCombination } from 'src/commons/decorators/is-enum-combination.decorator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { User } from '../entities/user.entity';

@ApiSchema({ name: 'User' })
export class ResponseUserDto {
  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'Identificador do usuário',
    example: '25fa73d2-9c17-4ea4-ac8a-c3cc8cfd17ac',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'João' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joao@domain.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '$2b$10$TE2l9Ym2N.A7G.nW9DbnRuTjg4OM2DVTZBMP4Ih145Du2UeumGCna',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Regras de permissão do usuário',
    example: AuthRolesEnum.ADMIN,
  })
  @IsNotEmpty()
  @IsEnumCombination(AuthRolesEnum)
  roles: string;

  @ApiProperty({ description: 'Usuário ativo', example: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  static fromEntity({
    id,
    name,
    email,
    password,
    roles,
    active,
  }: User): ResponseUserDto {
    return new ResponseUserDto({
      id,
      name,
      email,
      password,
      roles,
      active,
    });
  }
}
