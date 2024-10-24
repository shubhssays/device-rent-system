# Device Rent System

The **Device Rent System** is a backend service designed to manage borrowing and returning devices from an inventory. The system allows users to borrow devices, receive notifications on device allocation and return, and handles overdue notifications automatically. It is built using **Node.js** with **NestJS** or **Express**, **Sequelize** ORM, and incorporates asynchronous task handling for email notifications.

## Features

1. **Device Allocation**: Users can borrow devices from the inventory. If no device is available, allocation is not possible.
2. **Email Notifications**: 
   - Device allocation notifications are sent to the user.
   - Automatic overdue notifications are sent if the device is not returned after 5 days.
   - Confirmation emails are triggered upon the return of the device.
3. **Queuing Mechanism**: Asynchronous email notifications are handled via a queuing mechanism.
4. **Logging**: The system uses logging for monitoring and debugging.
5. **RESTful APIs**: Supports multiple endpoints with proper status codes.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **NestJS**: Web framework for building the API service.
- **Sequelize**: ORM for database interaction and migrations.
- **SQLite**: Database to store information about devices, users, and rentals.
- **Email Notifications**: Sent asynchronously via a queue (e.g., Bull with Redis).
- **Logging**: Logging is implemented using `winston` or another logging library.

## Project setup

```bash
# installing dependencies
$ npm install

# installing dependencies
$ cp .env.example .env

# running migration
$ npm run db:migrate

# running seeder for master data
$ npm run db:seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```