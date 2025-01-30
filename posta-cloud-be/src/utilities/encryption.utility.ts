import * as crypto from 'crypto';

export class EncryptionUtility {
  private static readonly IV_LENGTH = 16; // AES requires a 16-byte IV
  private static readonly ENCRYPTION_KEY = crypto
    .createHash('sha256')
    .update(String(process.env.ENCRYPTION_KEY || 'default_secret_key'))
    .digest('base64')
    .substring(0, 32); // AES-256 key must be 32 bytes

  // Encrypt text using AES-256-CBC
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(EncryptionUtility.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      EncryptionUtility.ENCRYPTION_KEY,
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return `${iv.toString('base64')}:${encrypted}`;
  }

  // Decrypt text using AES-256-CBC
  static decrypt(encrypted: string): string {
    const [iv, data] = encrypted.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      EncryptionUtility.ENCRYPTION_KEY,
      Buffer.from(iv, 'base64'),
    );
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
