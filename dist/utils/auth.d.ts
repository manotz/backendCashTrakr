export declare const hashPassword: (password: string) => Promise<string>;
export declare const checkPassword: (password: string, hash: string) => Promise<boolean>;
