export const VERSION: string = '0.0.1';
export const DEV: boolean = JSON.parse(process.env.DEV || 'false');
export const HTTP_SERVER_PORT: number = Number(process.env.AUTH_API) || 3000;
