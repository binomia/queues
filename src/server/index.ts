import {Server, Extensions} from "cromio";
import {mTLS, clients} from "./utils";
import {topUpsTriggerDefinition} from "./triggers";

const QUEUE_SERVER_PORT = Number(process.env.QUEUE_SERVER_PORT || 8002)
export const server = new Server({
    port: Number(QUEUE_SERVER_PORT),
    clients
})


server.addExtension(Extensions.serverPrometheusMetrics())
server.registerTriggerDefinition(topUpsTriggerDefinition);
