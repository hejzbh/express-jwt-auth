import crypto from "crypto";

export const hashPw = (pw: string): string => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPw = crypto
    .pbkdf2Sync(pw, salt, 10000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hashedPw}`;
};
