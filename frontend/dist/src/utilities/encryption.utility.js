"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionUtility = void 0;
const crypto = require("crypto");
class EncryptionUtility {
    static encrypt(text) {
        const iv = crypto.randomBytes(EncryptionUtility.IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', EncryptionUtility.ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return `${iv.toString('base64')}:${encrypted}`;
    }
    static decrypt(encrypted) {
        const [iv, data] = encrypted.split(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', EncryptionUtility.ENCRYPTION_KEY, Buffer.from(iv, 'base64'));
        let decrypted = decipher.update(data, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
exports.EncryptionUtility = EncryptionUtility;
EncryptionUtility.IV_LENGTH = 16;
EncryptionUtility.ENCRYPTION_KEY = crypto
    .createHash('sha256')
    .update(String(process.env.ENCRYPTION_KEY || 'default_secret_key'))
    .digest('base64')
    .substring(0, 32);
//# sourceMappingURL=encryption.utility.js.map