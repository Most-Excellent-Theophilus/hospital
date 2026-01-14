// backend/crypto.ts
import crypto from "crypto";

export function decryptAES({ base64Key, encryptedData }: { encryptedData: string, base64Key: string }) {
    const [ivB64, cipherB64] = encryptedData.split(":");
    const key = Buffer.from(base64Key, "base64");
    const iv = Buffer.from(ivB64, "base64");
    const ciphertext = Buffer.from(cipherB64, "base64");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

    // GCM requires authTag if used; for simplicity here we skip authTag in example
    // If using full GCM: append authTag at the end or in transmission

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}
