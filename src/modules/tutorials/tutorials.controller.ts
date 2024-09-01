import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../users/auth.guard';
import { AuthUser } from '../users/user.decorator';
import { FindTutorialByDto } from './dto/find-tutorial-by-dto';


@ApiTags('Tutorials')
@UseGuards(AuthGuard)
@ApiBearerAuth('jwt')
@Controller('tutorials')
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Post()
  create(@Body() createTutorialDto: CreateTutorialDto, @AuthUser() author: string) {
    return this.tutorialsService.create(createTutorialDto, author);
  }

  @Get()
  findOne(@Query() query: FindTutorialByDto) {
    return this.tutorialsService.findBy(query);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTutorialDto: CreateTutorialDto) {
    return this.tutorialsService.update(+id, updateTutorialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tutorialsService.remove(+id);
  }
}
