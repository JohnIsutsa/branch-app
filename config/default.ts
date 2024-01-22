import { getSocketUrl } from "@/utils/env.util";

export const SOCKET_URL = `${getSocketUrl()}` || 'http://localhost:9902';