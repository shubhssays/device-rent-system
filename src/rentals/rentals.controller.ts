import { Controller, Post, Body, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
    constructor(private rentalsService: RentalsService) { }

    @Post('allot')
    async allotDevice(@Body() data: { userId: number; deviceId: number }) {
        return this.rentalsService.allotDevice(data.userId, data.deviceId);
    }

    @Post('return')
    returnDevice(@Body() data: { rentalId: number }) {
        return this.rentalsService.returnDevice(data.rentalId);
    }

    @Get('user/:userId')
    getUserRentals(@Param('userId') userId: number) {
        return this.rentalsService.getUserRentals(userId);
    }
}
