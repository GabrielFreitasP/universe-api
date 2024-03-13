import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../commons/logger/logger.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    try {
      this.logger.debug(`Criando produto '${createProductDto.name}'.`);

      let product = new Product(createProductDto);
      product = await this.repository.save(product);

      this.logger.info(`Produto '${product.name}' criado.`);

      return ResponseProductDto.fromEntity(product);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(`Produto '${createProductDto.name}' já existe.`);
        throw new ConflictException(
          `Product with name '${createProductDto.name}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar produto '${createProductDto.name}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create product');
    }
  }

  async findAll(): Promise<ResponseProductDto[]> {
    try {
      this.logger.debug(`Buscando produtos.`);

      const products = await this.repository.find();

      this.logger.debug(`${products.length} produtos encontrados.`);

      return products.map((product) => ResponseProductDto.fromEntity(product)); // Alteração no nome do DTO
    } catch (error) {
      this.logger.error(
        `Erro ao buscar lista de produtos: '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find all products');
    }
  }

  async findOne(id: string): Promise<ResponseProductDto> {
    try {
      this.logger.debug(`Buscando produto pelo id '${id}'.`);

      const product = await this.repository.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Nenhum produto encontrado pelo id '${id}'.`);
        throw new NotFoundException('Product not found');
      }

      this.logger.debug(
        `Produto '${product.name}' encontrado pelo id '${id}'.`,
      );

      return ResponseProductDto.fromEntity(product);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar produto pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one product');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ResponseProductDto> {
    // Alteração no nome do DTO
    try {
      this.logger.debug(`Atualizando produto pelo id '${id}'.`);

      let product = await this.repository.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Nenhum produto encontrado pelo id '${id}'.`);
        throw new NotFoundException('Product not found');
      }

      product = new Product({ ...product, ...updateProductDto });
      product = await this.repository.save(product);

      this.logger.info(`Produto '${product.name}' atualizado.`);

      return ResponseProductDto.fromEntity(product);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar produto pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update product');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando produto pelo id '${id}'.`);

      const product = await this.repository.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Nenhum produto encontrado pelo id '${id}'.`);
        throw new NotFoundException('Product not found');
      }

      await this.repository.softDelete(id);

      this.logger.info(`Produto '${product.name}' deletado.`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar produto pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove product');
    }
  }
}
