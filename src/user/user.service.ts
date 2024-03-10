import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
      this.logger.debug(
        `Criando um novo usuário. E-mail: ${createUserDto.email}.`,
      );

      let user = new User(createUserDto);
      user = await this.repository.save(user);

      this.logger.debug(
        `Usuário criado com sucesso. E-mail: ${createUserDto.email}.`,
      );

      return ResponseUserDto.fromEntity(user);
    } catch (error) {
      if (error.code === '23505') {
        this.logger.warn(
          `Usuário já existe no banco de dados. E-mail: ${createUserDto.email}.`,
        );

        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      this.logger.error(
        `Erro ao criar usuário. E-mail: ${createUserDto.email}. Mensagem de erro: ${error.message}.`,
      );
      throw new InternalServerErrorException('Error creating user');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${updateUserDto.name} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
