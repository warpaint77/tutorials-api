import { Test, TestingModule } from '@nestjs/testing';
import { TutorialsController } from './tutorials.controller';
import { TutorialsService } from './tutorials.service';
import { JwtService } from '@nestjs/jwt';
import { PaginationService } from '../../common/pagination/pagination.service';
import { FindTutorialByDto } from './dto/find-tutorial-by-dto';
import { Tutorial } from './entities/tutorial.entity';

describe('TutorialsController', () => {
  let controller: TutorialsController;
  let service: TutorialsService;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorialsController],
      providers: [
        {
        
          provide: TutorialsService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findBy: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
        JwtService,
        {
          provide: PaginationService,
          useValue: {
            toPagedList: jest.fn().mockResolvedValue({}),
          }
        }
      ],
    }).compile();

    controller = module.get<TutorialsController>(TutorialsController);
    service = module.get<TutorialsService>(TutorialsService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
  it('should call findBy method with correct params', async () => {
    const items: Tutorial[] = [
      { id: 1, author: "user", title: 'NestJS Basics', body: "NestJS Basics", creationDate: new Date(), updateDate: new Date() },
    ];

    const pagedList = {
      page: 1, 
      take: 10,
      items: items,
      itemsCount: 1,
      pageCount: 1
    }

    const findDto: FindTutorialByDto = {
      startDate: new Date(),
      endDate: new Date(),
      title: 'NestJS Basics',
      page: 1,
      take: 10
    }

    jest.spyOn(service, 'findBy').mockResolvedValue(pagedList);

    expect(await controller.findOne(findDto)).toBe(pagedList);
    expect(service.findBy).toHaveBeenCalledWith(findDto);
  });
});
