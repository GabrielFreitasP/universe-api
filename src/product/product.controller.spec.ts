import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const createFakeCreateProductDto = (): CreateProductDto => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stockQuantity: faker.number.int({ min: 1, max: 1000 }),
  });

  const createFakeUpdateProductDto = (): UpdateProductDto => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stockQuantity: faker.number.int({ min: 1, max: 1000 }),
  });

  const createFakeResponseProductDto = (): ResponseProductDto => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stockQuantity: faker.number.int({ min: 1, max: 1000 }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = createFakeCreateProductDto();
      const responseProductDto = createFakeResponseProductDto();
      jest
        .spyOn(productService, 'create')
        .mockResolvedValue(responseProductDto);

      expect(await controller.create(createProductDto)).toBe(
        responseProductDto,
      );
    });

    it('should return 400 when parameters are invalid', async () => {
      const createProductDto = createFakeCreateProductDto();
      jest
        .spyOn(productService, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return 401 when not authorized', async () => {
      const createProductDto = createFakeCreateProductDto();
      jest
        .spyOn(productService, 'create')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(controller.create(createProductDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return 409 when product already exists', async () => {
      const createProductDto = createFakeCreateProductDto();
      jest
        .spyOn(productService, 'create')
        .mockRejectedValueOnce(new ConflictException());

      await expect(controller.create(createProductDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const responseProductDtoArray: ResponseProductDto[] = [
        createFakeResponseProductDto(),
        createFakeResponseProductDto(),
      ];
      jest
        .spyOn(productService, 'findAll')
        .mockResolvedValue(responseProductDtoArray);

      expect(await controller.findAll()).toBe(responseProductDtoArray);
    });

    it('should return 401 when not authorized', async () => {
      jest
        .spyOn(productService, 'findAll')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(controller.findAll()).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 'valid_product_id';
      const responseProductDto = createFakeResponseProductDto();
      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(responseProductDto);

      expect(await controller.findOne(productId)).toBe(responseProductDto);
    });

    it('should return 404 when product not found', async () => {
      const nonExistentProductId = 'non_existent_id';
      jest
        .spyOn(productService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne(nonExistentProductId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = 'valid_product_id';
      const updateProductDto = createFakeUpdateProductDto();
      const responseProductDto = createFakeResponseProductDto();
      jest
        .spyOn(productService, 'update')
        .mockResolvedValue(responseProductDto);

      expect(await controller.update(productId, updateProductDto)).toBe(
        responseProductDto,
      );
    });

    it('should return 404 when product not found', async () => {
      const nonExistentProductId = 'non_existent_id';
      const updateProductDto = createFakeUpdateProductDto();
      jest
        .spyOn(productService, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.update(nonExistentProductId, updateProductDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = 'valid_product_id';
      jest.spyOn(productService, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(productId)).toBeUndefined();
    });

    it('should return 404 when product not found', async () => {
      const nonExistentProductId = 'non_existent_id';
      jest
        .spyOn(productService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove(nonExistentProductId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
