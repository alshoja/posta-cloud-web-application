export declare class EncryptionUtility {
    private static readonly IV_LENGTH;
    private static readonly ENCRYPTION_KEY;
    static encrypt(text: string): string;
    static decrypt(encrypted: string): string;
}
