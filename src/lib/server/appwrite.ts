import { Client, Databases, Storage, Account } from 'node-appwrite';

/**
 * Creates an Appwrite client instance with Admin privileges (using API Key).
 * This function should ONLY be called from server-side code (Server Components, Server Actions, API Routes).
 */
export function createAdminClient() {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!projectId || !apiKey) {
        throw new Error('Appwrite Project ID or API Key is missing');
    }

    const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        }
    };
}
