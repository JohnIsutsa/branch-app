import axios from "axios";
import getAPIBaseUrl from "./env.util";

const getInstances = () => {
    return {
        instanceRest: axios.create({
            baseURL: `${getAPIBaseUrl()}/api`,
            headers: {
                "Content-Type": "application/json"
            }
        }),
    };
};

export const restInstance = getInstances().instanceRest; 