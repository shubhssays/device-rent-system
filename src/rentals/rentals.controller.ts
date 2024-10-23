import { Controller, Post, Body, Get, HttpException, HttpStatus, Param, UsePipes } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentedDeviceSchema, ReturnRentedDeviceSchema, UserRentedDeviceSchema } from 'src/schemas/rentals.schema';
import { ZodValidationPipe } from 'src/pipes/ZodvalidationPipe';

@Controller('rentals')
export class RentalsController {
    constructor(private rentalsService: RentalsService) { }

    @UsePipes(new ZodValidationPipe(RentedDeviceSchema))
    @Post('allot')
    async allotDevice(@Body() data: { userId: number; deviceId: number }) {
        const result = this.rentalsService.allotDevice(data.userId, data.deviceId);
        return result;
    }

    @UsePipes(new ZodValidationPipe(ReturnRentedDeviceSchema))
    @Post('return')
    async returnDevice(@Body() data: { rentalId: number }) {
        const result = await this.rentalsService.returnDevice(data.rentalId);
        return result
    }

    @UsePipes(new ZodValidationPipe(UserRentedDeviceSchema))
    @Get('user/:userId')
    async getUserRentals(@Param('userId') userId: number) {
        const rentedDevices = await this.rentalsService.getUserRentals(userId) || [];
        return {
            message: 'User rentals fetched successfully',
            rentedDevices: rentedDevices,
        }
    }

    @Get('/')
    async getRentals() {
        const rentedDevices = await this.rentalsService.getAllRentals();
        return {
            message: 'All rentals fetched successfully',
            rentedDevices: rentedDevices,
        }
    }
}
