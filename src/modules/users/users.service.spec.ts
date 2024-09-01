import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

// Mock the bcrypt library
jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, 
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn()
          }, 
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.save with the correct parameters', async () => {
    const user = new User();
    const hashedPassword = "hashedJerry";

    user.username = 'Tom';
    user.password = hashedPassword;
    user.email = "tom@mail.com";

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    await service.create(user);
    expect(repository.save).toHaveBeenCalledWith(user);
  });

  it('should return a user by username', async () => {
    const user = new User();
    user.id = 1;
    user.username = 'testuser';

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

    const result = await service.findOneByUsername('testuser');

    expect(repository.findOneBy).toHaveBeenCalledWith({ username: 'testuser' });

    expect(result).toEqual(user);
  });

    it('should return a JWT token for valid credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = 'hashedpassword123';
      const user = new User();
      user.username = username;
      user.email = "testuser@mail.com";
      user.password = hashedPassword;

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const token = 'jwt';
      ( jwtService.signAsync as jest.Mock).mockReturnValue(token);

      const result = await service.login(username, password);

      expect(repository.findOneBy).toHaveBeenCalledWith({ username });

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);

      const expectedPayload = { username: user.username, email: user.email };
      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload);

      expect(result).toEqual({"access_token": token});
    });

    it('should delete a user successfully', async () => {
      const existingUser = { id: 1, username: 'user', email: 'user@mail.com', password: 'senha' } as User;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingUser);
  
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);
  
      await service.remove(1);
  
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);
  
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  
      await expect(service.remove(1)).rejects.toThrow(
        'User with ID 1 not found',
      );
    });
});
