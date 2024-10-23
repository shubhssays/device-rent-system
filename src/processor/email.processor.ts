import { Processor, Process, OnQueueCompleted, OnQueueFailed, OnQueueActive, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';

@Processor(process.env.EMAIL_QUEUE_NAME)
@Injectable()
export class EmailProcessor {
    @Process()
    async handleEmail(job: Job, done: Function) {
        try {
            const { to, subject, body } = job.data;

            // Implement your email sending logic here
            console.log(`Sending email to: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body: ${body}`);

            // Simulating email sending delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

        } catch (e) {
            console.error('EmailProcessor error', e)
            throw e;
        }
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        console.log(`Email sent to: ${job.data.to}`);
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        console.error(`Failed to send email to: ${job.data.to}`);
        console.error(`Error: ${error.message}`);
    }
}
