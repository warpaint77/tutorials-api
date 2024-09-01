import { Test, TestingModule } from '@nestjs/testing';
import { TutorialsService } from './tutorials.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../../common/pagination/pagination.service';
import { FindTutorialByDto } from './dto/find-tutorial-by-dto';
import { NotFoundException } from '@nestjs/common';

describe('TutorialsService', () => {
  let service: TutorialsService;
  let repository: Repository<Tutorial>;
  let paginationService: PaginationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialsService, 
        PaginationService,
        JwtService,
        {
          provide: getRepositoryToken(Tutorial),
          useValue: {
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn()
          }
        },
        PaginationService
      ],
    }).compile();

    service = module.get<TutorialsService>(TutorialsService);
    repository = module.get<Repository<Tutorial>>(getRepositoryToken(Tutorial));
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repository.save with the correct parameters', async () => {
    const tutorial = new Tutorial();

    const date = new Date();
    date.setMilliseconds(0);

    tutorial.author = "user";
    tutorial.body = "test";
    tutorial.title = "how to unit test with jest";
    tutorial.creationDate = date;
    tutorial.updateDate = date;
    
    await service.create(tutorial, "user");
    expect(repository.save).toHaveBeenCalledWith(tutorial);
  });

  it('should return tutorials by title', async () => {
    const date = new Date();
    date.setMilliseconds(0);

    const items: Tutorial[] = [
      { id: 1, author: "user", title: 'NestJS Basics', body: "NestJS Basics", creationDate: date, updateDate: date },
    ];

    const findDto: FindTutorialByDto = {
      title: 'NestJS Basics',
      page: 1,
      take: 10
    }
    
    jest.spyOn(repository, 'findAndCount').mockResolvedValue([items, 1]);

    const pagedList = paginationService.toPagedList(findDto.page, findDto.take, 1, items)

    expect(await service.findBy(findDto)).toEqual(pagedList);
  });

  it('should return tutorials by date', async () => {
    const date = new Date();
    date.setMilliseconds(0);

    const items: Tutorial[] = [
      { id: 1, author: "user", title: 'NestJS Basics', body: "NestJS Basics", creationDate: date, updateDate: date },
    ];

    const findDto: FindTutorialByDto = {
      startDate: new Date(),
      endDate: new Date(),
      page: 1,
      take: 10
    }
    
    jest.spyOn(repository, 'findAndCount').mockResolvedValue([items, 1]);

    jest.spyOn(repository, 'findAndCount').mockResolvedValue([items, 1]);

    const pagedList = paginationService.toPagedList(findDto.page, findDto.take, 1, items)

    expect(await service.findBy(findDto)).toEqual(pagedList);
  });

  it('should update the tutorial successfully', async () => {
    const date = new Date();
    date.setMilliseconds(0);

    const updateDto = { title: 'Updated Title' };
    const existingTutorial = { id: 1, title: 'Old Title', body: 'body', creationDate: date, updateDate: date, author: 'user' } as Tutorial;
    const updatedTutorial = { id: 1, title: 'Updated Title', body: 'body', creationDate: date, updateDate: date, author: 'user' } as Tutorial;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingTutorial);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedTutorial);

    expect(await service.update(1, updateDto)).toEqual(updatedTutorial);

    expect(repository.save).toHaveBeenCalledWith(updatedTutorial);
  });

  it('should update the tutorial successfully', async () => {
    const date = new Date();
    date.setMilliseconds(0);

    const updateDto = { body: 'Updated body' };
    const existingTutorial = { id: 1, title: 'Title', body: 'body', creationDate: date, updateDate: date, author: 'user' } as Tutorial;
    const updatedTutorial = { id: 1, title: 'Title', body: 'Updated body', creationDate: date, updateDate: date, author: 'user' } as Tutorial;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingTutorial);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedTutorial);

    expect(await service.update(1, updateDto)).toEqual(updatedTutorial);

    expect(repository.save).toHaveBeenCalledWith(updatedTutorial);
  });

  it('should throw NotFoundException if tutorial does not exist', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    await expect(service.update(1, { title: 'Updated Title' }))
      .rejects
      .toThrow(NotFoundException);
  });

  it('should delete a tutorial successfully', async () => {
    const date = new Date();
    date.setMilliseconds(0);

    const existingTutorial = { id: 1, title: 'Title', body: 'body', creationDate: date, updateDate: date, author: 'user' } as Tutorial;
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingTutorial);

    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    await service.remove(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if tutorial does not exist', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);

    await expect(service.remove(1)).rejects.toThrow(
      'Tutorial with ID 1 not found',
    );
  });

});
