import CryptoJS from "crypto-js";

// Ensure the secret key is 16 bytes (e.g., "1234567890123456")
const secretKey = CryptoJS.enc.Utf8.parse("2316457891023546");

// Initialization vector (must also be 16 bytes)
const iv = CryptoJS.enc.Utf8.parse("2316457891023546");

export const encryptID = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id, secretKey, { iv }).toString();
  const base64UrlSafe = encodeURIComponent(encrypted);
  return base64UrlSafe;
};

export const decryptID = (encryptedID) => {
  try {
    const decoded = decodeURIComponent(encryptedID);
    const bytes = CryptoJS.AES.decrypt(decoded, secretKey, { iv });
    const originalID = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalID) throw new Error("Decryption failed");
    return originalID;
  } catch (error) {
    console.error("Error during decryption:", error.message);
    return null;
  }
};
