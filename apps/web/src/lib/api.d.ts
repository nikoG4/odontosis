type RequestOptions = {
    method?: string;
    body?: unknown;
    token?: string | null;
};
export declare function api<T>(path: string, options?: RequestOptions): Promise<T>;
export {};
