import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rental } from './rental.model';
import { Device } from '../devices/device.model';
import { User } from '../users/user.model';

@Injectable()
export class RentalsService {
    constructor(
        @InjectModel(Rental) private rentalModel: typeof Rental,
        @InjectModel(Device) private deviceModel: typeof Device,
        @InjectModel(User) private userModel: typeof User,
    ) { }

    async allotDevice(userId: number, deviceId: number) {
        const device = await this.deviceModel.findByPk(deviceId);
        if (!device || !device.isAvailable) {
            throw new HttpException('Device not available', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }

        await this.rentalModel.create({ userId, deviceId, rentedOn: new Date() });
        device.isAvailable = false;
        await device.save();

        // Send email asynchronously using a queue (e.g., Bull)
        // await this.notificationService.sendEmail(user.email, 'Device Allotted');

        return { message: 'Device allotted successfully' };
    }

    async returnDevice(rentalId: number) {
        const rental = await this.rentalModel.findByPk(rentalId);
        if (!rental || rental.returnedOn) {
            throw new HttpException('Invalid rental or already returned', HttpStatus.BAD_REQUEST);
        }

        const device = await this.deviceModel.findByPk(rental.deviceId);
        rental.returnedOn = new Date();
        await rental.save();

        device.isAvailable = true;
        await device.save();

        // Send return confirmation email asynchronously
        // await this.notificationService.sendEmail(user.email, 'Device Returned');

        return { message: 'Device returned successfully' };
    }

    async getUserRentals(userId: number) {
        return this.rentalModel.findAll({ where: { userId }, include: [Device] });
    }
}
