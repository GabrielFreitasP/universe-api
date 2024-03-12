import { ApiProperty } from '@nestjs/swagger';

export class ResponseLoginDto {
  @ApiProperty({
    description: 'E-mail autenticado',
    example: 'admin@domain.com',
  })
  email: string;

  @ApiProperty({
    description: 'Chave de acesso da API',
    example: '$2y$04$cYSc/jadfCXbodVtFKK8gOjmJER4UyY23Aw7ncstJ571yfcB.6TZC',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Tempo de expiração da chave de acesso',
    example: '3000s',
  })
  expiresIn: string;
}
