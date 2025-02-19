import { hashPw } from "./hashPw.js";
import db from "@/lib/db.js";

export const createUser = async (email: string, password: string) => {
  return await db?.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashPw(password),
        },
      },
    },
  });
};
