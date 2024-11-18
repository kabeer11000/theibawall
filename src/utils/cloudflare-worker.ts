export default class CloudflareWorkerClient {
    apiUrl: string;
    database: string;
    constructor(apiUrl:string, database:string = 'pending') {
        this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
        this.database = database;
    }

    /**
     * Retrieve a value by key.
     */
    async get(key:string) {
        return await this.makeRequest('get', { key });
    }

    /**
     * Create a new entry with a 20-hour expiration.
     */
    async create(key:string, value:string) {
        return await this.makeRequest('create', {
            key,
            value: encodeURIComponent(JSON.stringify(value)),
        });
    }

    /**
     * Update an existing entry with a 20-hour expiration.
     */
    async update(key:string, value: object) {
        return await this.makeRequest('update', {
            key,
            value: encodeURIComponent(JSON.stringify(value)),
        });
    }

    /**
     * Delete an entry.
     */
    async delete(key:string) {
        return await this.makeRequest('delete', { key });
    }

    /**
     * List all entries (keys only).
     */
    async list() {
        return await this.makeRequest('list');
    }

    /**
     * Helper method to make a request to the Cloudflare Worker API.
     */
    async makeRequest(operation:string, params = {}) {
        params.operation = operation;
        params.database = this.database;

        const url = `${this.apiUrl}?${new URLSearchParams(params).toString()}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error communicating with Cloudflare Worker API: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Request failed: ${error.message}`);
        }
    }
}
