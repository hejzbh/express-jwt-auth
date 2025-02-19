import { CustomError } from "@/lib/customError.js";
import jwt from "jsonwebtoken";

export function refreshAccessToken(refreshToken: string) {
  const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY!);

  if (!decoded)
    throw new CustomError(
      "Something went wrong while generating a new token",
      401
    );

  return jwt.sign(
    { id: decoded.id, email: decoded.email },
    process.env.ACCESS_TOKEN_KEY!,
    {
      expiresIn: "1m",
    }
  ); // new access token
}
