import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'UpdateProduct' })
export class UpdateProductDto {
  @ApiProperty({
    description: 'Novo nome do produto',
    example: 'Camiseta Nova',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Nova descrição do produto',
    example: 'Camiseta branca de algodão atualizada',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Novo preço do produto',
    example: 25.99,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @ApiProperty({
    description: 'Nova quantidade em estoque',
    example: 150,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stockQuantity: number;
}
