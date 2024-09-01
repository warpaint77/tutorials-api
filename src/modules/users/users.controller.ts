import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    
    return this.usersService.create(createUserDto);
    
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto.username, loginDto.password)
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
