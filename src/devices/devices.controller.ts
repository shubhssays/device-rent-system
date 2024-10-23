import { Controller, Get, Query } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { ZodValidationPipe } from 'src/pipes/ZodvalidationPipe';
import { DeviceListSchema } from 'src/schemas/devices.schema';

@Controller('devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) { }

    @Get('available')
    async findAvailable(@Query(new ZodValidationPipe(DeviceListSchema)) query: { page: number, pageSize: number }) {
        const devices = await this.devicesService.findAvailable(query.page, query.pageSize);
        return {
            message: 'Devices available for rent',
            devices,
        }
    }

    @Get('unavailable')
    async findUnAvailable(@Query(new ZodValidationPipe(DeviceListSchema)) query: { page: number, pageSize: number }) {
        const devices = await this.devicesService.findUnAvailable(query.page, query.pageSize);
        return {
            message: 'Devices unavailable',
            devices,
        }
    }
}