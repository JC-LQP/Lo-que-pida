export declare class HashService {
    private readonly saltRounds;
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hash: string): Promise<boolean>;
}
