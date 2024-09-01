import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  saltOrRounds = 10;

  constructor(@InjectRepository(User) private userRepository: Repository<User>, 
  private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) {

    const user = new User();

    const hash = await bcrypt.hash(createUserDto.password, this.saltOrRounds);

    user.email = createUserDto.email;
    user.password = hash;
    user.username = createUserDto.username;

    const isUserRegistered = await this.userRepository.exists({ where: {email: user.email}}) 
    || await this.userRepository.exists({ where: {username: user.username}})

    if(!isUserRegistered){
      return this.userRepository.save(user);
    } else {
      throw new HttpException("User already registered", 400);
    }
  }

  async login(username: string, password: string) {
    const user = await this.findOneByUsername(username);
    
    if(user) {
      const isMatch = await bcrypt.compare(password, user.password);
    
      if(isMatch) {
        const payload = { email: user.email, username: user.username };
        
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new UnauthorizedException();
      }
    }
    else {
      throw new UnauthorizedException();
    }
  }

  findOneByUsername(username: string) : Promise<Partial<User>>{
    return this.userRepository.findOneBy({ username: username})
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({id: id})

    if(user) {
      return this.userRepository.delete(id)
    }
    else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
