import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { Device } from './device.model'; // Import Device model

@Module({
  imports: [
    SequelizeModule.forFeature([Device]) // Register the Device model here
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService] // Export DevicesService for use in other modules if needed
})
export class DevicesModule {}