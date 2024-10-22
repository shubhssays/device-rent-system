import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.model';  // Import the User model

@Module({
  imports: [
    SequelizeModule.forFeature([User]), // Register User model with Sequelize
  ],
  providers: [UsersService], // Register the UsersService
  controllers: [UsersController], // Register the UsersController
  exports: [UsersService], // Export UsersService for use in other modules if needed
})
export class UsersModule {}
