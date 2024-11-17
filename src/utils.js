import CryptoJS from "crypto-js";
const salt = process.env.NEXT_PUBLIC_SALT;

export const encryptData = async (data) => {
  if (!salt) {
    throw new Error(
      "Encryption salt is not defined in the environment variables."
    );
  }

  
  try {
    const ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(data), salt);
    return ciphertext.toString();
  } catch (err) {
    console.error("Encryption failed:", err);
  }
};

export const decryptData = async (ciphertext) => {
  try {
    const bytes = await CryptoJS.AES.decrypt(ciphertext, salt);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return null;
  }
};