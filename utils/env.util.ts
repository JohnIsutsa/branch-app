function getAPIBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
        throw new Error('API base URL is not defined in environment variables');
    }
    return baseUrl;
}

export default getAPIBaseUrl;