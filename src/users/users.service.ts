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
        return this.userRepository.findAll();
    }

    // Find user by ID
    async findOne(id: number): Promise<User> {
        return this.userRepository.findByPk(id);
    }

    // Create a new user
    async create(userData: Partial<User>): Promise<User> {
        return this.userRepository.create(userData);
    }

    // Update user by ID
    async update(id: number, updateData: Partial<User>): Promise<User> {
        const user = await this.findOne(id);
        if (user) {
            return user.update(updateData);
        }
        throw new Error('User not found');
    }

    // Delete user by ID
    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (user) {
            await user.destroy();
        } else {
            throw new Error('User not found');
        }
    }
}
