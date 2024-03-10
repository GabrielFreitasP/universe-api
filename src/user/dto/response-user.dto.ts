import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import ApiSchema from 'src/commons/decorators/api-schema.decorator';
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

  @ApiProperty({ description: 'E-mail do usuário', example: 'joão@domain.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  static fromEntity({ id, name, email }: User): ResponseUserDto {
    return new ResponseUserDto({ id, name, email });
  }
}
