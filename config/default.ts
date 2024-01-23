import getAPIBaseUrl from "@/utils/env.util";

export const SOCKET_URL = `${getAPIBaseUrl()}/chat` || 'http://localhost:9900/chat';