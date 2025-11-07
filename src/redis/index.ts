import Redis from "ioredis";
import MainController from "@/controllers/mainController";
import {createBullBoard} from "@bull-board/api";
import {DOCKER_MODE} from "@/constants";

export const connection = {
    host: DOCKER_MODE ? "redis" : "localhost",
    port: 6379,
    enableOfflineQueue: false,
}

export const redis = new Redis(connection)

export const initRedisEventSubscription = async (bullDashboard: ReturnType<typeof createBullBoard>) => {
    process.on("message", async ({channel, payload}: { channel: string, payload: string }) => {
        await MainController.listenToRedisEvent({channel, payload, bullDashboard})
    })
}