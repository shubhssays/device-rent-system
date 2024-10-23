import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/logger.service';
const logger = new MyLogger();

@Processor(process.env.EMAIL_QUEUE_NAME)
@Injectable()
export class EmailProcessor {
    @Process()
    async handleEmail(job: Job, done: Function) {
        try {
            const { to, subject, body } = job.data;

            // Implement your email sending logic here
            logger.log(`Sending email to: ${to}`);
            logger.log(`Subject: ${subject}`);
            logger.log(`Body: ${body}`);

            // Simulating email sending delay
            await new Promise((resolve) => setTimeout(resolve, 2000));
            done();
        } catch (e) {
            logger.error('EmailProcessor error', e)
            throw e;
        }
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        logger.log(`Email sent to: ${job.data.to}`);
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        logger.error(`Failed to send email to: ${job.data.to}`, error.message);
    }
}
