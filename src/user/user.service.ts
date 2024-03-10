import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/commons/logger/logger.service';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      this.logger.debug(`Criando usuário '${createUserDto.email}'.`);

      let user = new User(createUserDto);
      user = await this.repository.save(user);

      this.logger.info(`Usuário '${user.email}' criado.`);

      return ResponseUserDto.fromEntity(user);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(`Usuário '${createUserDto.email}' já existe.`);
        throw new ConflictException(
          `User with email '${createUserDto.email}' already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar usuário '${createUserDto.email}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to create user');
    }
  }

  async findAll(): Promise<ResponseUserDto[]> {
    try {
      this.logger.debug(`Buscando usuários.`);

      const users = await this.repository.find();

      this.logger.debug(`${users.length} usuários encontrados.`);

      return users.map((user) => ResponseUserDto.fromEntity(user));
    } catch (error) {
      this.logger.error(`Erro ao buscar lista usuários: '${error.message}'.`);
      throw new InternalServerErrorException('Error to find all users');
    }
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    try {
      this.logger.debug(`Buscando usuários pelo id '${id}'.`);

      const user = await this.repository.findOneBy({ id });

      if (!user) {
        this.logger.warn(`Nenhum usuário encontrado pelo id '${id}'.`);
        throw new NotFoundException('User not found');
      }

      this.logger.debug(`Usuário '${user.email}' encontrado pelo id '${id}'.`);

      return ResponseUserDto.fromEntity(user);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao buscar usuário pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to find one user');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      this.logger.debug(`Atualizando usuário pelo id '${id}'.`);

      let user = await this.repository.findOneBy({ id });

      if (!user) {
        this.logger.warn(`Nenhum usuário encontrado pelo id '${id}'.`);
        throw new NotFoundException('User not found');
      }

      user = new User({ ...user, ...updateUserDto });
      user = await this.repository.save(user);

      this.logger.info(`Usuário '${user.email}' atualizado.`);

      return ResponseUserDto.fromEntity(user);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao atualizar usuário pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to update user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.debug(`Deletando usuário pelo id '${id}'.`);

      const user = await this.repository.findOneBy({ id });

      if (!user) {
        this.logger.warn(`Nenhum usuário encontrado pelo id '${id}'.`);
        throw new NotFoundException('User not found');
      }

      await this.repository.softDelete({ id });

      this.logger.info(`Usuário '${user.email}' deletado.`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Erro ao deletar usuário pelo id '${id}': '${error.message}'.`,
      );
      throw new InternalServerErrorException('Error to remove user');
    }
  }
}
