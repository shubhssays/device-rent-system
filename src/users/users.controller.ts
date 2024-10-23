import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/ZodvalidationPipe';
import { UserListSchema } from 'src/schemas/users.schemas';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Query(new ZodValidationPipe(UserListSchema)) query: { page: number, pageSize: number }) {
        const users = await this.usersService.findAll(query.page, query.pageSize);
        return {
            message: 'User list',
            users,
        }
    }
}