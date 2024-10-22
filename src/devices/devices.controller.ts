import { Controller, Get } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) { }

    @Get('available')
    async findAvailable() {
        const devices = await this.devicesService.findAvailable();
        return {
            message: 'Devices available for rent',
            devices,
        }
    }
}