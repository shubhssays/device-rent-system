import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';

@Processor(process.env.EMAIL_QUEUE_NAME)
@Injectable()
export class EmailProcessor {
    @Process()
    async handleEmail(job: Job) {
        const { to, subject, body } = job.data;

        // Implement your email sending logic here
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);

        // Simulating email sending delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
}
