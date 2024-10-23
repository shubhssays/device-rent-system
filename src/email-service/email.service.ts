import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EMAIL_FORMAT } from '../constants/email';

interface SendEmailParams {
    to: string;
    templateKey: any;
}

@Injectable()
export class EmailService {
    constructor(@InjectQueue(process.env.EMAIL_QUEUE_NAME) private emailQueue: Queue) { }

    async sendEmail({ to, templateKey }: SendEmailParams) {
        const emailFormat = EMAIL_FORMAT[templateKey];

        if (!emailFormat) {
            throw new Error(`Email template ${templateKey} not found`);
        }
        // Add a job to the email queue
        await this.emailQueue.add({
            to,
            subject: emailFormat.subject,
            text: emailFormat.body,
        });
    }
}