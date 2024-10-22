import { Column, ForeignKey, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Device } from '../devices/device.model';
import { User } from '../users/user.model';

@Table
export class Rental extends Model {
    @ForeignKey(() => Device)
    @Column
    deviceId: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column
    rentedOn: Date;

    @Column({ allowNull: true })
    returnedOn: Date;

    @BelongsTo(() => Device)
    device: Device;

    @BelongsTo(() => User)
    user: User;
}