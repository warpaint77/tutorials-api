import { Module } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { TutorialsController } from './tutorials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { PaginationService } from '../../common/pagination/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tutorial])],
  exports: [TypeOrmModule],
  controllers: [TutorialsController],
  providers: [TutorialsService, PaginationService],
})
export class TutorialsModule {}
