import { Controller, Get } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) { }

    @Get('available')
    findAvailable() {
        return this.devicesService.findAvailable();
    }
}