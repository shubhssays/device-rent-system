import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rental } from './rental.model';
import { Device } from '../devices/device.model';
import { User } from '../users/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RentalsService {
    constructor(
        @InjectModel(Rental) private rentalModel: typeof Rental,
        @InjectModel(Device) private deviceModel: typeof Device,
        @InjectModel(User) private userModel: typeof User,
        private sequelize: Sequelize,
    ) { }

    async allotDevice(userId: number, deviceId: number) {
        const transaction = await this.deviceModel.sequelize.transaction();

        try {
            const device = await this.deviceModel.findByPk(deviceId, { transaction, attributes: ['id', 'isAvailable'] });
            console.log('device', device);
            if (!device) {
                throw new HttpException('Device not available', HttpStatus.BAD_REQUEST);
            }

            // Check if the device is already allotted
            if (!device.isAvailable) {
                throw new HttpException('Device already allotted to the user', HttpStatus.BAD_REQUEST);
            }

            const user = await this.userModel.findByPk(userId, { transaction, attributes: ['id'] });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
            }

            const rental = await this.rentalModel.create(
                { userId, deviceId, rentedOn: new Date() },
                { transaction }
            );

            device.isAvailable = false;
            await device.save({ transaction });

            // Send email asynchronously using a queue (e.g., Bull)
            // await this.notificationService.sendEmail(user.email, 'Device Allotted');

            // Commit the transaction
            await transaction.commit();

            return { rentalId: rental.id, message: 'Device allotted successfully' };
        } catch (error) {
            // Rollback the transaction if any error occurs
            await transaction.rollback();
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async returnDevice(rentalId: number) {
        const transaction = await this.sequelize.transaction();

        try {
            const rental = await this.rentalModel.findByPk(rentalId, { transaction, attributes: ['id', 'returnedOn', 'deviceId'] });
            if (!rental) {
                throw new HttpException('Invalid rental', HttpStatus.BAD_REQUEST);
            }

            // Check if the device is already returned
            if (rental.returnedOn) {
                throw new HttpException('Device already returned', HttpStatus.BAD_REQUEST);
            }

            const device = await this.deviceModel.findByPk(rental.deviceId, { transaction, attributes: ['id'] });
            if (!device) {
                throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
            }

            // Update rental record to set returnedOn date
            rental.returnedOn = new Date();
            await rental.save({ transaction });

            // Update the device status to available
            device.isAvailable = true;
            await device.save({ transaction });

            // Commit the transaction
            await transaction.commit();

            // Send return confirmation email asynchronously (optional)
            // await this.notificationService.sendEmail(user.email, 'Device Returned');

            return { message: 'Device returned successfully' };
        } catch (error) {
            // Rollback the transaction if any error occurs
            await transaction.rollback();
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserRentals(userId: string) {
        let rentedDevices: any = await this.rentalModel.findAll({
            where: { userId: Number(userId) },
            attributes: { exclude: ['deviceId', 'userId', 'createdAt', 'updatedAt'] },
            include: [
                {
                    model: Device,
                    attributes: ['id', 'name', 'isAvailable']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        rentedDevices = this.formatRentalDevicesData(Array.isArray(rentedDevices) ? rentedDevices : [rentedDevices]) as any;
        return rentedDevices;
    }

    async getAllRentals() {
        let rentedDevices: any = await this.rentalModel.findAll({
            attributes: { exclude: ['deviceId', 'userId', 'createdAt', 'updatedAt'] },
            include: [
                {
                    model: Device,
                    attributes: ['id', 'name', 'isAvailable']
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        rentedDevices = this.formatRentalDevicesData(Array.isArray(rentedDevices) ? rentedDevices : [rentedDevices]) as any;
        return rentedDevices;
    }

    formatRentalDevicesData(rentedDevices: Rental[]) {
        rentedDevices = JSON.parse(JSON.stringify(rentedDevices));
        const rentedDevicesDetails = rentedDevices.map((rd) => {
            const rentedOn = new Date(rd.rentedOn);
            const returnedOn = rd.returnedOn ? new Date(rd.returnedOn) : new Date();
            const rentedForDays = Math.ceil((returnedOn.getTime() - rentedOn.getTime()) / (1000 * 60 * 60 * 24)); // Calculate days
            return {
                ...rd,
                rentedForDays,
            }
        });
        return rentedDevicesDetails;
    }
}
