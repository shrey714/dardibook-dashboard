import CryptoJS from "crypto-js";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const salt = process.env.NEXT_PUBLIC_SALT;

export const encryptData = async (data: any) => {
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

export const decryptData = async (ciphertext: any) => {
  try {
    const bytes = await CryptoJS.AES.decrypt(ciphertext, salt || "hfytft");
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error("failed:", err);
    return null;
  }
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
