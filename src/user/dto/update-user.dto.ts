import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import ApiSchema from 'src/commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateUser' })
export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Senha do usuário', example: '123' })
  password: string;
}
