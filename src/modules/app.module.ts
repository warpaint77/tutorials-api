import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { TutorialsController } from './tutorials/tutorials.controller';
import { UsersService } from './users/users.service';
import { TutorialsService } from './tutorials/tutorials.service';
import { UsersModule } from './users/users.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from '../common/pagination/pagination.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/test-db',
      entities: [__dirname + '/*/entities/*.entity.{ts,js}'],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: "jwt-simple-secret",
      signOptions: { expiresIn:  '30m'},
    }),
    UsersModule,
    TutorialsModule
  ],
  controllers: [UsersController, TutorialsController],
  providers: [UsersService, TutorialsService, PaginationService],
})
export class AppModule {
}
