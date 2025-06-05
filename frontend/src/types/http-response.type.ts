export type HttpResponseType<T = any> = {
    error: boolean;
    response: T | null;
    redirect?: string;
};