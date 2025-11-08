import {connection} from "@/redis";
import {Queue} from "bullmq";
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import TransactionsQueue from "./transactionQueues";
import TopUpQueue from "./topUpQueues";
import NotificationQueues from "./notificationQueues";

export const createQueue = (name: string): Queue => {
    return new Queue(name, {connection})
}

export const transactionsQueue = new TransactionsQueue()
export const topUpQueue = new TopUpQueue()
const notificationQueue = new NotificationQueues();


export const queuesBullAdapter = [
    new BullMQAdapter(transactionsQueue.queue),
    new BullMQAdapter(topUpQueue.queue),
    new BullMQAdapter(notificationQueue.queue)
];


