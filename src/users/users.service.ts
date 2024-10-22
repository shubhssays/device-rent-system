import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly userRepository: typeof User, // Inject the User model
    ) { }

    // Get all users
    async findAll(): Promise<User[]> {
        return this.userRepository.findAll({
            attributes: ['id', 'name', 'email'],
        });
    }

    // Find user by ID
    async findOne(id: number): Promise<User> {
        return this.userRepository.findByPk(id);
    }
}
