import {Job, JobJson, Queue, Worker} from "bullmq";
import {connection} from "@/redis";
import {AES} from "cryptografia";
import {BULL_MQ_JOBS_NAMES, NOTIFICATION_TRIGGERS, ZERO_ENCRYPTION_KEY} from "@/constants";
import {notificationRpcClient} from "@/rpc/clients/notificationRPC";
import {safeJSONParse} from "@/helpers";

export default class NotificationQueues {
    queue: Queue;

    constructor() {
        this.queue = new Queue("notifications", {connection});
        this.workers().catch(e => console.error({notificationWorkerError: e}));
    }

    private executeJob = async (job: JobJson) => {
        const name = job.name.split("@")[0]
        try {
            switch (name) {
                case NOTIFICATION_TRIGGERS.PUSH_EXPO_NOTIFICATION: {
                    const decryptedData = await AES.decryptAsync(safeJSONParse(job.data), ZERO_ENCRYPTION_KEY)
                    const data = safeJSONParse(decryptedData)
                    await notificationRpcClient(NOTIFICATION_TRIGGERS.PUSH_EXPO_NOTIFICATION, data)
                    break;
                }
                case BULL_MQ_JOBS_NAMES.TRANSACTION_NOTIFICATION: {
                    const decryptedData = await AES.decryptAsync(safeJSONParse(job.data), ZERO_ENCRYPTION_KEY)
                    const data = safeJSONParse(decryptedData)
                    await notificationRpcClient(NOTIFICATION_TRIGGERS.SOCKET_EVENT_EMITTER, data).then((result) => {
                        console.log({result})
                    })
                    break;
                }
                default: {
                    break;
                }
            }

        } catch (e) {
            console.log({NotificationWorkerError: e});
        }
    }

    private workers = async () => {
        const worker = new Worker('notifications', async (job) => this.executeJob(job.asJSON()), {
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