import { Module, OnModuleInit } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DevicesModule } from './devices/devices.module';
import { RentalsModule } from './rentals/rentals.module';
import { UsersModule } from './users/users.module';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Device } from './devices/device.model';
import { Rental } from './rentals/rental.model';
import { User } from './users/user.model';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'sqlite',
            storage: './database.sqlite',
            // autoLoadModels: true,
            // synchronize: true,
            models: [Device, User, Rental], // Register models here
        }),
        DevicesModule,   // Register DevicesModule
        RentalsModule,   // Register RentalsModule
        UsersModule,     // Register UsersModule
        SequelizeModule.forFeature([Device, User, Rental]),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor, // Register the interceptor globally
        },
    ],
})

export class AppModule implements OnModuleInit {
    private dbFilePath = path.resolve(__dirname, './database.sqlite');

    constructor() { }

    async onModuleInit() {
        await this.createDatabaseFileIfNotExists();
    }

    private async createDatabaseFileIfNotExists() {
        const dbFilePath = './database.sqlite';
        try {

            // Check if the database file exists
            await fs.access(dbFilePath);
            console.log(`Database file ${dbFilePath} already exists.`);
        } catch (error) {
            // If it does not exist, create it
            await fs.writeFile(dbFilePath, '');
            console.log(`Database file ${dbFilePath} created.`);
        }
    }
}
