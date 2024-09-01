import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { Tutorial } from './entities/tutorial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { FindTutorialByDto } from './dto/find-tutorial-by-dto';
import { PaginationService } from '../../common/pagination/pagination.service';

@Injectable()
export class TutorialsService {

  constructor(
    @InjectRepository(Tutorial) private tutorialRepository: Repository<Tutorial>,
    private readonly paginationService: PaginationService){
    }

  async create(createTutorialDto: CreateTutorialDto, author: string) {
    
    const tutorial = new Tutorial();

    const date = new Date();

    date.setMilliseconds(0);

    tutorial.author = author;
    tutorial.title = createTutorialDto.title;
    tutorial.body = createTutorialDto.body;
    tutorial.creationDate = date;
    tutorial.updateDate = date;

    const isTitleRegistered = await this.tutorialRepository.exists({ where: {title: tutorial.title}});

    if(!isTitleRegistered){
      return this.tutorialRepository.save(tutorial);
    } else {
      throw new HttpException("Title already registered.", 400);
    }
  }

  async findBy(query: FindTutorialByDto) {
    const page: number = query.page;
    const take: number = query.take;

    const where = [];

    if(query.title) {
      where.push({['title']: Like(`%${query.title}%`)})
    }

    if(query.startDate && query.endDate) {
      const start = new Date(query.startDate)
      const end = new Date(query.endDate)

      start.setMilliseconds(0)
      end.setMilliseconds(0)

      where.push(
        {['creationDate']: Between(start, end)},
        {['updateDate']: Between(start, end)})
     }

    const [items, count] = await this.tutorialRepository.findAndCount({
      where: where,
      order: {
        creationDate: 'ASC'
      },
      skip: take*(page-1),
      take: take
    });

    return this.paginationService.toPagedList(page, take, count, items);
  }

  async update(id: number, updateTutorialDto: Partial<Tutorial>) {

    const tutorial = await this.tutorialRepository.findOneBy({ id: id });

    if(tutorial) {
      const date = new Date();
      date.setMilliseconds(0);

      tutorial.body = updateTutorialDto.body ? updateTutorialDto.body : tutorial.body; 
      tutorial.title = updateTutorialDto.title ? updateTutorialDto.title : tutorial.title;
      tutorial.updateDate = date;

      return this.tutorialRepository.save(tutorial);

    } else {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    const tutorial = await this.tutorialRepository.findOneBy({id: id})

    if(tutorial) {
      return this.tutorialRepository.delete(id)
    }
    else {
      throw new NotFoundException(`Tutorial with ID ${id} not found`);
    }
  }
}
