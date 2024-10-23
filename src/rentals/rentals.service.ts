import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rental } from './rental.model';
import { Device } from '../devices/device.model';
import { User } from '../users/user.model';
import { Sequelize } from 'sequelize-typescript';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Op } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MyLogger } from 'src/logger/logger.service';
const logger = new MyLogger();

@Injectable()
export class RentalsService {
    constructor(
        @InjectModel(Rental) private rentalRepository: typeof Rental,
        @InjectModel(Device) private deviceRepository: typeof Device,
        @InjectModel(User) private userRepository: typeof User,
        private sequelize: Sequelize,
        @InjectQueue(process.env.EMAIL_QUEUE_NAME) private emailQueue: Queue
    ) { }

    async allotDevice(userId: number, deviceId: number) {
        const transaction = await this.deviceRepository.sequelize.transaction();

        try {
            const device = await this.deviceRepository.findByPk(deviceId, { transaction, attributes: ['id', 'isAvailable'] });
            if (!device) {
                throw new HttpException('Device not available', HttpStatus.BAD_REQUEST);
            }

            // Check if the device is already allotted
            if (!device.isAvailable) {
                throw new HttpException('Device already allotted to the user', HttpStatus.BAD_REQUEST);
            }

            const user = await this.userRepository.findByPk(userId, { transaction, attributes: ['id', 'email'] });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
            }

            const rental = await this.rentalRepository.create(
                { userId, deviceId, rentedOn: new Date() },
                { transaction }
            );

            device.isAvailable = false;
            await device.save({ transaction });

            // Send email asynchronously using a queue
            await this.emailQueue.add({
                to: user.email,
                subject: 'Device Allocated',
                body: 'You have been allocated a device. Please collect it from the admin.'
            });

            // Commit the transaction
            await transaction.commit();

            return { rentalId: rental.id, message: 'Device allotted successfully' };
        } catch (error) {
            logger.error(error.message, error.stack);
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
            const rental = await this.rentalRepository.findByPk(rentalId, { transaction, attributes: ['id', 'returnedOn', 'deviceId', 'userId'] });
            if (!rental) {
                throw new HttpException('Invalid rental', HttpStatus.BAD_REQUEST);
            }

            // Check if the device is already returned
            if (rental.returnedOn) {
                throw new HttpException('Device already returned', HttpStatus.BAD_REQUEST);
            }

            const user = await this.userRepository.findByPk(rental.userId, { transaction, attributes: ['id', 'email'] });
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const device = await this.deviceRepository.findByPk(rental.deviceId, { transaction, attributes: ['id'] });
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
            await this.emailQueue.add({
                to: user.email,
                subject: 'Device Returned',
                body: 'You have returned the device. Thank you!'
            });

            return { message: 'Device returned successfully' };
        } catch (error) {
            logger.error(error.message, error.stack);
            // Rollback the transaction if any error occurs
            await transaction.rollback();
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserRentals(userId: number, page: number = 1, pageSize: number = 10) {
        const offset = (page - 1) * pageSize;

        let { rows: rentedDevices, count }: any = await this.rentalRepository.findAndCountAll({
            where: { userId },
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
            ],
            limit: pageSize,
            offset
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / pageSize);

        rentedDevices = this.formatRentalDevicesData(Array.isArray(rentedDevices) ? rentedDevices : [rentedDevices]) as any;
        const response = {
            data: rentedDevices,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                pageSize,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
        return response;
    }

    async getAllRentals(page: number = 1, pageSize: number = 10) {
        const offset = (page - 1) * pageSize;

        let { rows: rentedDevices, count }: any = await this.rentalRepository.findAndCountAll({
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
            ],
            limit: pageSize,
            offset
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / pageSize);

        rentedDevices = this.formatRentalDevicesData(Array.isArray(rentedDevices) ? rentedDevices : [rentedDevices]) as any;
        const response = {
            data: rentedDevices,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                pageSize,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
        return response;
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

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkOverdueRentals() {
        const overdueSeconds = 5 * 24 * 60 * 60; // 5 days = 5 * 24 hours * 60 minutes * 60 seconds
        // const overdueSeconds = 5; // 5 seconds for testing

        const currentDate = new Date();
        const localTime = currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000); // Adjusting for local timezone offset
        const overdueDate = new Date(localTime);


        // Subtract the overdue time (converted to milliseconds) from the current date
        overdueDate.setTime(overdueDate.getTime() - overdueSeconds * 1000);

        // Find all rentals that have not been returned and were rented on or before the overdue date
        const overdueRentals = await this.rentalRepository.findAll({
            where: {
                returnedOn: null,  // Not yet returned
                rentedOn: {
                    [Op.lte]: overdueDate  // Rented on or before the overdue date
                }
            },
            include: [
                {
                    model: Device,
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    attributes: ['id', 'email']
                }
            ]
        });

        // Send email notifications to users with overdue rentals
        for (const rental of overdueRentals) {
            const user = rental.user;
            await this.emailQueue.add({
                to: user.email,
                subject: 'Overdue Device Return',
                body: `The device ${rental.device.name} is overdue for return. Please return it immediately.`
            });
        }

        const result = { message: overdueRentals.length > 0 ? 'Overdue rentals checked and notifications sent.' : 'No overdue rentals found.' };
        logger.log(result.message);
    }
}
