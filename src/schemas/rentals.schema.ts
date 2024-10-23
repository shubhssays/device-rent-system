import { z } from 'zod';

export const RentedDeviceSchema = z.object({
    userId: z.number({
        required_error: "userId is required",
        invalid_type_error: "userId must be a positive integer",
    }).min(1).positive().int(),
    deviceId: z.number({
        required_error: "deviceId is required",
        invalid_type_error: "deviceId must be a positive integer",
    }).min(1).positive().int(),
});

export const ReturnRentedDeviceSchema = z.object({
    rentalId: z.number({
        required_error: "rentalId is required",
        invalid_type_error: "rentalId must be a positive integer",
    }).min(1).positive().int(),
});

export const UserRentedDeviceSchema = z.object({
    userId: z.string({
        required_error: "userId is required",
        invalid_type_error: "userId must be a positive integer with a minimum value of 1",
    }).refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
        message: "userId must be a positive integer with a minimum value of 1",
    }).transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1) {
            throw new Error("userId must be a positive integer with a minimum value of 1");
        }
        return parsed;
    }),
});