import crypto from "crypto";

export const comparePw = (pw: string, storedHash: string): boolean => {
  const [salt, originalHash] = storedHash.split(":");
  const hashedPw = crypto
    .pbkdf2Sync(pw, salt, 10000, 64, "sha512")
    .toString("hex");

  return hashedPw === originalHash;
};
