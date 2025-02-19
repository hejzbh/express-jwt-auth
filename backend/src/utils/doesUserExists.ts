import db from "@/lib/db.js";

export const doesUserExists = async (
  email: string,
  extra?: {
    include: {
      password: true;
    };
  }
) =>
  await db?.user.findFirst({
    where: {
      email,
      // With password (Useful in login)
    },
    include: extra?.include,
  });
