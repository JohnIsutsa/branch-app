function getAPIBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
        throw new Error('API base URL is not defined in environment variables');
    }
    return baseUrl;
}

export function getSocketUrl(): string {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!socketUrl) {
        throw new Error('Socket URL is not defined in environment variables');
    }
    return socketUrl;
}

export default getAPIBaseUrl;