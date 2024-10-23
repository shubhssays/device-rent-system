import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';
import { Request } from 'express';

@Injectable()
export class SchemaValidationError extends BadRequestException {
    formattedErrors: any;

    constructor(error: ZodError) {
        // Call the base class BadRequestException
        super();
        // Assign formatted message to the object
        this.formattedErrors = this.formatErrors(error);
        this.message = 'Validation failed';
    }

    // Method to format the error messages
    formatErrors(error: ZodError): any {
        // Handle Zod validation errors
        return error?.flatten()?.fieldErrors;
    }
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodSchema) { }
    transform(value: any) {
        const result = this.schema.safeParse(value);
        if (result.success) {
            return result.data;
        }
        // Throw SchemaValidationError with formatted Zod errors
        throw new SchemaValidationError(result.error);
    }
}
