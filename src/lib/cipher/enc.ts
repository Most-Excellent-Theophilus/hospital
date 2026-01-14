"use client"
export async function encryptAES({base64Key, text}:{text: string, base64Key: string}) {
    const keyBuffer = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        "AES-GCM",
        false,
        ["encrypt"]
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        data
    );

    // Convert to Base64 for transmission
    const ivB64 = btoa(String.fromCharCode(...iv));
    const cipherB64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));

    return `${ivB64}:${cipherB64}`;
}
