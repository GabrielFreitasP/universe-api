import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import ApiSchema from '../../commons/decorators/api-schema.decorator';
import { Product } from '../entities/product.entity';

@ApiSchema({ name: 'ResponseProduct' })
export class ResponseProductDto {
  constructor(partial: Partial<ResponseProductDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'Identificador do produto',
    example: '25fa73d2-9c17-4ea4-ac8a-c3cc8cfd17ac',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;

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
  @IsString()
  price: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  @IsNotEmpty()
  @IsString()
  stockQuantity: number;

  static fromEntity({
    id,
    name,
    description,
    price,
    stockQuantity,
  }: Product): ResponseProductDto {
    return new ResponseProductDto({
      id,
      name,
      description,
      price,
      stockQuantity,
    });
  }
}
