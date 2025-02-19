import jwt from "jsonwebtoken";

export const generateTokens = (userId: string, email: string) => {
  return {
    accessToken: jwt.sign(
      { id: userId, email },
      process.env.ACCESS_TOKEN_KEY!,
      {
        expiresIn: "1m",
      }
    ),
    refreshToken: jwt.sign(
      {
        id: userId,
        email,
      },
      process.env.REFRESH_TOKEN_KEY!,
      { expiresIn: "1d" }
    ),
  };
};
