// rentals.module.ts
import { MiddlewareConsumer, Module, RequestMethod, Request } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { Rental } from './rental.model';
import { Device } from '../devices/device.model';
import { User } from '../users/user.model';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SequelizeModule.forFeature([Rental, Device, User]), // Register all necessary models
    BullModule.registerQueue({
      name: process.env.EMAIL_QUEUE_NAME,
    }),
    ScheduleModule.forRoot()
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
  exports: [RentalsService],
})
export class RentalsModule { }