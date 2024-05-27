import schedule from 'node-schedule';
import { createPage } from '../notion/pages.js'

export async function scheduleJobs() {
    if(!global._scheduledJobs) {
        {
            const d = new Date();
            console.log('scheduleJobs register', d, d.getDate(), d.getHours());
        }
        const jobNotion = schedule.scheduleJob('0 5 0 * * *', async function(){
            const d = new Date();
            console.log('scheduleJobs notion createPage triggered', d, d.getDate(), d.getDay(), d.getHours());
            const result = await createPage();
            console.log('scheduleJobs notion createPage', result);
        });
        global._scheduledJobs = [jobNotion];
    }
}