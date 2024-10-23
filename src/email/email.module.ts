import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailProcessor } from 'src/processor/email.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: process.env.EMAIL_QUEUE_NAME, // Make sure this matches the processor name
        }),
    ],
    providers: [EmailProcessor],
})
export class EmailModule { }