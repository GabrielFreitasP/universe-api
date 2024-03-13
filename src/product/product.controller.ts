import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthRolesEnum } from '../auth/enums/auth-roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../commons/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('/api/v1/products')
@ApiTags('Produtos')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({ summary: 'Cria novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado',
    type: ResponseProductDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 409, description: 'Produto já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ResponseProductDto> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca lista de produtos' })
  @ApiResponse({
    status: 200,
    description: 'Produtos encontrados',
    type: ResponseProductDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  findAll(): Promise<ResponseProductDto[]> {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN, AuthRolesEnum.USER)
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca produto pelo id' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findOne(@Param('id') id: string): Promise<ResponseProductDto> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateProductDto })
  @ApiOperation({ summary: 'Atualiza produto pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado',
    type: ResponseProductDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ResponseProductDto> {
    return this.productService.update(id, updateProductDto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta produto pelo id' })
  @ApiResponse({ status: 204, description: 'Produto deletado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão de acesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AuthRolesEnum.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
