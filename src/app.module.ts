import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DevicesModule } from './devices/devices.module'; // Import DevicesModule
import { RentalsModule } from './rentals/rentals.module'; // Import RentalsModule
import { UsersModule } from './users/users.module'; // Import UsersModule

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'sqlite',  // or your DB type (mysql, postgres, etc.)
            storage: './database.sqlite',  // Path for SQLite, if you're using it
            autoLoadModels: true,
            synchronize: true,
        }),
        DevicesModule,   // Register DevicesModule
        RentalsModule,   // Register RentalsModule
        UsersModule,     // Register UsersModule
    ],
})
export class AppModule { }
