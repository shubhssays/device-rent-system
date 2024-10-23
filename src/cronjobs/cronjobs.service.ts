import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronjobsService {
    constructor(private schedulerRegistry: SchedulerRegistry) { }

    async testCron() {
        const job = new CronJob('* * * * * *', () => {
            console.log('My cron running...');
        });

        this.schedulerRegistry.addCronJob('sec', job);
        job.start();
    }
}