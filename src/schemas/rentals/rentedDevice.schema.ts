import { z } from 'zod';

const RentedDeviceSchema = z.object({
    userId: z.number({
        required_error: "userId is required",
        invalid_type_error: "userId must be a positive integer",
    }).min(1).positive().int(),
    deviceId: z.number({
        required_error: "deviceId is required",
        invalid_type_error: "deviceId must be a positive integer",
    }).min(1).positive().int(),
});

export default RentedDeviceSchema;