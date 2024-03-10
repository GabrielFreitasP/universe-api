import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoggerService } from '../commons/logger/logger.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { faker } from '@faker-js/faker';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const createFakeUser = (): User =>
    new User({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: faker.date.anytime(),
      updatedAt: faker.date.anytime(),
      deletedAt: null,
    });

  const createFakeCreateUserDto = (): CreateUserDto => ({
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  const createFakeUpdateUserDto = (): UpdateUserDto => ({
    name: faker.person.firstName(),
    password: null,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        LoggerService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = createFakeCreateUserDto();

      const user = new User(createUserDto);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await service.create(createUserDto);
      expect(result).toEqual(ResponseUserDto.fromEntity(user));
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = createFakeCreateUserDto();

      jest.spyOn(repository, 'save').mockRejectedValue({ code: '23505' });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto: CreateUserDto = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest.spyOn(repository, 'save').mockRejectedValue(new Error());

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [createFakeUser(), createFakeUser()];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(
        users.map((user) => ResponseUserDto.fromEntity(user)),
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error());

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find one user by id', async () => {
      const id = faker.string.uuid();
      const user = createFakeUser();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const result = await service.findOne(id);
      expect(result).toEqual(ResponseUserDto.fromEntity(user));
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = faker.string.uuid();
      const updateUserDto = createFakeUpdateUserDto();

      const existingUser = new User(updateUserDto);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser);
      jest
        .spyOn(repository, 'save')
        .mockImplementation((user: User) => Promise.resolve(user));

      const result = await service.update(id, updateUserDto);
      expect(result).toEqual(ResponseUserDto.fromEntity(existingUser));
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = faker.string.uuid();
      const updateUserDto = createFakeUpdateUserDto();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const id = faker.string.uuid();
      const updateUserDto = createFakeUpdateUserDto();
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = faker.string.uuid();
      const existingUser = createFakeUser();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser);
      jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);

      await service.remove(id);
      expect(repository.softDelete).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const id = faker.string.uuid();
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error());

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
