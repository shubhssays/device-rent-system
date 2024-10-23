import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly userRepository: typeof User, // Inject the User model
    ) { }

    // Get all users
    async findAll(page: number = 1, pageSize: number = 10) {
        const offset = (page - 1) * pageSize;
        const { rows, count } = await this.userRepository.findAndCountAll({
            attributes: ['id', 'name', 'email'],
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
