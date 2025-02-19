import { Password, User } from "@prisma/client";
import { Request } from "express";

export type UserWithPassword = User & {
  password: Password;
};

export type RequestWithUser = Request & {
  user: {
    id: string;
    email: string;
  };
};

export type CacheOptions = {
  key: string;
  userDependent?: boolean;
};
