import {Job, JobJson, Queue, Worker} from "bullmq";
import {connection} from "@/redis";


export default class GlobalQueues {
    queue: Queue;

    constructor() {
        this.queue = new Queue("global", {connection});
        this.workers().catch((_) => {})
    }

    private executeJob = async (_job: JobJson) => {

    }

    private workers = async () => {
        const worker = new Worker('transactions', async (job) => this.executeJob(job.asJSON()), {
            connection,
            settings: {
                backoffStrategy: (attemptsMade: number) => attemptsMade * 1000
            }
        });

        worker.on('completed', (job: Job) => {
            console.log('Job completed', job.repeatJobKey);
        })
    }
}