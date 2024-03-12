import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestLoginDto {
  @ApiProperty({
    description: 'E-mail para autenticação',
    example: 'joão@domain.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha para autenticação', example: '123' })
  @Transform(({ value }: TransformFnParams) => value.toString())
  @IsNotEmpty()
  @IsString()
  password: string;
}
