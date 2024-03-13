import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { UserRoles } from '../entities/user.entity';

@ApiSchema({ name: 'UpdateUser' })
export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João',
    required: false,
  })
  @IsString()
  name: string | null;

  @ApiProperty({
    description: 'Senha do usuário',
    example: '123',
    required: false,
  })
  @IsString()
  password: string | null;

  @ApiProperty({
    description: 'Regras de permissão do usuário',
    example: 'admin',
    required: false,
  })
  @IsIn(['admin', 'user', null])
  roles: UserRoles | null;
}
