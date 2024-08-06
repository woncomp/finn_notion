import schedule from 'node-schedule';
import { createPage } from '../notion/pages.js'

export async function scheduleJobs() {
    if(!global._scheduledJobs) {
        {
            const d = new Date();
            console.log('scheduleJobs register', d, d.getDate(), d.getHours());
        }
        async function postCreatePageWithRetry(retryCount) {
            const d = new Date();
            console.log('scheduleJobs notion createPage triggered', d, d.getDate(), d.getDay(), d.getHours());
            try {
                const result = await createPage();
                console.log('scheduleJobs notion createPage', result);
            } catch (error) {
                if(retryCount > 0) {
                    console.log('scheduleJobs notion retry', retryCount);
                    setTimeout(() => postCreatePageWithRetry(retryCount-1), 6*1000);
                } else {
                    console.log('scheduleJobs notion out of retry times');
                }
            }
        }
        const jobNotion = schedule.scheduleJob('0 5 0 * * *', () => postCreatePageWithRetry(5));
        global._scheduledJobs = [jobNotion];
    }
}
