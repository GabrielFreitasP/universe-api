import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('/api/v1/users')
@ApiTags('Usuários')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Cria novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca lista de usuários' })
  @ApiResponse({
    status: 200,
    description: 'Usuários encontrados',
    type: ResponseUserDto,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findAll(): Promise<ResponseUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Busca usuário pelo id' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseUserDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Atualiza usuário pelo id' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta usuário pelo id' })
  @ApiResponse({ status: 204, description: 'Usuário deletado' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno' })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
