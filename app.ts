import {initRedisEventSubscription} from "@/redis";
import {DASHBOARD_FAVICON_URL, DASHBOARD_LOGO_URL,} from "@/constants";
import express, {Express} from 'express';
import {server as httpServer} from "@/server";
import {createBullBoard} from '@bull-board/api';
import {queuesBullAdapter, topUpQueue, transactionsQueue} from "@/queues";
import {dbConnection} from "@/config";
import {initTracing} from "@/tracing";
import {ExpressAdapter} from "@bull-board/express";

const app: Express = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/')

httpServer.start(async (url: string) => {
    const bullDashboard = createBullBoard({
        queues: queuesBullAdapter,
        serverAdapter,
        options: {
            uiConfig: {
                boardTitle: "",
                favIcon: {
                    default: DASHBOARD_FAVICON_URL,
                    alternative: DASHBOARD_FAVICON_URL,
                },
                boardLogo: {
                    width: 200,
                    height: 35,
                    path: DASHBOARD_LOGO_URL,
                },
                locale: {
                    lng: "es",
                },
                dateFormats: {
                    common: "EEEE, MMM. d yyyy, h:mma",
                    short: "EEEE, MMM. d yyyy, h:mma",
                    full: "EEEE, MMM. d yyyy, h:mma"
                }
            }
        }
    });

    await Promise.all([
        initTracing(),
        dbConnection(),
        dbConnection(),
        initRedisEventSubscription(bullDashboard)
    ])

    app.use('/', serverAdapter.getRouter());
    app.listen(9002, () => {
        console.log("BullMQ dashboard  listening on http://localhost:9002");
    })

    console.log(`Server running at ${url}`);
});