import crypto from "crypto";

// Secret key for signing (should be stored securely)
const SECRET_KEY = process.env.cloud_token_key;

// Generate token with a TTL (in seconds)
function generateToken(userId, ttl = 3600) {
    const timestamp = Math.floor(Date.now() / 1000);  // Current time in seconds
    const payload = `${userId}:${timestamp}`;

    // Create HMAC signature
    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(payload)
        .digest("base64url");  // Use 'base64url' encoding for URL-safe tokens

    // Return token as payload.signature
    return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

// Verify the token and check if it has expired
function verifyToken(token, ttl = 3600) {
    try {
        const [payloadB64, signature] = token.split(".");
        const payload = Buffer.from(payloadB64, "base64url").toString();
        const [userId, timestamp] = payload.split(":");
        const tokenTimestamp = parseInt(timestamp, 10);

        // Check expiration
        if (Math.floor(Date.now() / 1000) > tokenTimestamp + ttl) {
            return { valid: false, message: "Token expired" };
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(payload)
            .digest("base64url");

        if (signature !== expectedSignature) {
            return { valid: false, message: "Invalid signature" };
        }

        return { valid: true, userId };  // Token is valid

    } catch (error) {
        return { valid: false, message: "Token verification failed" };
    }
}
export const CreateToken = (text: string): string => generateToken(text) as string;