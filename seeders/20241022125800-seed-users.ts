'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Seed data for 10 users
        const users = [
            { name: 'Alice Johnson', email: 'alice@example.com' },
            { name: 'Bob Smith', email: 'bob@example.com' },
            { name: 'Charlie Brown', email: 'charlie@example.com' },
            { name: 'David Wilson', email: 'david@example.com' },
            { name: 'Emma Davis', email: 'emma@example.com' },
            { name: 'Fiona White', email: 'fiona@example.com' },
            { name: 'George Taylor', email: 'george@example.com' },
            { name: 'Hannah Clark', email: 'hannah@example.com' },
            { name: 'Ivy Martinez', email: 'ivy@example.com' },
            { name: 'Jack Anderson', email: 'jack@example.com' },
        ];

        // Insert the devices into the database
        await queryInterface.bulkInsert('Users', users, {});
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the inserted devices
        await queryInterface.bulkDelete('Users', null, {});
    }
};