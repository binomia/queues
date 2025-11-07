import {ANOMALY_SERVER_URL, ZERO_ENCRYPTION_KEY} from "@/constants";
import {Client, ClientTypes, LOAD_BALANCER} from "cromio"


const client = new Client({
    loadBalancerStrategy: LOAD_BALANCER.BEST_BIASED,
    servers: [
        {
            url: ANOMALY_SERVER_URL,
            secretKey: ZERO_ENCRYPTION_KEY,
        }
    ]
});

export const anomalyRpcClient = async (trigger: string, params: any): Promise<ClientTypes.TriggerResponseType> => {
    try {
        return await client.trigger(trigger, params)

    } catch (error: any) {
        throw new Error(error);
    }
}
