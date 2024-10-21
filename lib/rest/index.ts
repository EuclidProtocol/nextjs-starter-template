export class RestClient {
    private _base_url: string;

    constructor(base_url: string) {
        this._base_url = base_url;
    }

    async get(url: string) {
        const response = await fetch(`${this._base_url}${url}`);
        return response.json();
    }

    async post(url: string, data: any) {
        const response = await fetch(`${this._base_url}${url}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.json();
    }
}

const restClient = new RestClient(process.env.NEXT_PUBLIC_API_URL!);

export default restClient;
