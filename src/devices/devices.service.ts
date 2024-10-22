import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Device } from './device.model';

@Injectable()
export class DevicesService {
    constructor(@InjectModel(Device) private deviceModel: typeof Device) { }

    async findAvailable() {
        return this.deviceModel.findAll({ where: { isAvailable: true }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
    }

}
