import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Device extends Model {
    @Column
    name: string;

    @Column({ defaultValue: true })
    isAvailable: boolean;
}