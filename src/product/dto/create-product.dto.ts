import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';

@ApiSchema({ name: 'CreateProduct' })
export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Camiseta' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camiseta branca de algodão',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Preço do produto', example: 19.99 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stockQuantity: number;
}
