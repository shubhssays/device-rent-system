import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Device } from './device.model';

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Device) private deviceRepository: typeof Device) { }

    async findAvailable(page: number = 1, pageSize: number = 10) {
        const offset = (page - 1) * pageSize;
        const { rows, count } = await this.deviceRepository.findAndCountAll({
            where: { isAvailable: true },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            limit: pageSize,
            offset
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / pageSize);

        const response = {
            data: rows,
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

    async findUnAvailable(page: number = 1, pageSize: number = 10) {
        const offset = (page - 1) * pageSize;
        const { rows, count } = await this.deviceRepository.findAndCountAll({
            where: { isAvailable: false },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            limit: pageSize,
            offset
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / pageSize);

        const response = {
            data: rows,
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
}
