import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {   
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            login: jest.fn().mockResolvedValue([]),
            findAll: jest.fn().mockResolvedValue({}),
            findOneByUsername: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          }
        },
        JwtService
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
