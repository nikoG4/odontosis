export declare function useApi(): {
    get: <T>(path: string) => Promise<T>;
    post: <T>(path: string, body: unknown) => Promise<T>;
    patch: <T>(path: string, body: unknown) => Promise<T>;
    put: <T>(path: string, body: unknown) => Promise<T>;
};
