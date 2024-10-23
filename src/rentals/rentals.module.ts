// rentals.module.ts
import { MiddlewareConsumer, Module, RequestMethod, Request } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { Rental } from './rental.model';
import { Device } from '../devices/device.model';
import { User } from '../users/user.model';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    SequelizeModule.forFeature([Rental, Device, User]), // Register all necessary models
    BullModule.registerQueue({
      name: 'send_email_notification',
    }),
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
  exports: [RentalsService], // Export RentalsService for use in other modules if needed
})
export class RentalsModule { }