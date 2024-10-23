import { z } from 'zod';

export const DeviceListSchema = z.object({
    page: z.string({
        required_error: "page is required",
        invalid_type_error: "page must be a positive number with a minimum value of 1",
    }).transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1) {
            throw new Error("page must be a positive number with a minimum value of 1");
        }
        return parsed;
    }).optional(),

    pageSize: z.string({
        required_error: "pageSize is required",
        invalid_type_error: "pageSize must be a positive number between 1 and 20",
    }).transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed < 1 || parsed > 20) {
            throw new Error("pageSize must be a positive number between 1 and 20");
        }
        return parsed;
    }).optional()
});