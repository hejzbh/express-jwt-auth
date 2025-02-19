import { NextFunction, Request, Response } from "express";
import { CustomError } from "@/lib/customError.js";
import { doesUserExists } from "@/utils/doesUserExists.js";
import { createUser } from "@/utils/createUser.js";
import { comparePw } from "@/utils/comparePw.js";
import { UserWithPassword } from "types.js";
import { generateTokens } from "@/utils/generateTokens.js";
import { refreshAccessToken } from "@/utils/refreshToken.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) Get email and password from body
    const { email, password } = req.body;

    // 2) If data is missing
    if (!email || !password) throw new CustomError("Data is missing", 400);

    // 3) Try to get user
    const user = await doesUserExists(email, {
      include: { password: true },
    });

    // 4) If there is no user
    if (!user)
      throw new CustomError("User with that e-mail doesn't exists", 400);

    // 5) Compare passwords
    if (!comparePw(password, (user as UserWithPassword).password?.hash))
      throw new CustomError("Invalid credentials", 400);

    delete (user as any)["password"];

    // 6) Generate JWT Acess & Refresh tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    // 7) If something went wrong with access token
    if (!accessToken)
      throw new CustomError("Cannot generate Access Token", 500);

    // 8) Store refresh & Access token in HTTP cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1d
      secure: true,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 5 * 1000, // 1m
    });

    // 9) Return token in the response
    res.status(200).json({
      message: "You've succesfully logged in",
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1) Get email and password from body
    const { email, password } = req.body;

    // 2) If data is missing
    if (!email || !password) throw new CustomError("Data is missing", 400);

    //  3) Validation ('Cause we dontn want to put large string in our database)
    if (password.length >= 35)
      throw new CustomError("Your password is too long (MAX: 35)", 400);

    // 4) Check does user exists
    let user = await doesUserExists(email);

    // 5) If user exists, throw error
    if (user)
      throw new CustomError("User with same e-mail already exists", 400);

    // 6) Create
    user = await createUser(email, password);

    // 7) Check is user successfully created
    if (!user)
      throw new CustomError("Something went wrong while creating user", 500);

    // 8) User is created, register is done!
    res.status(201).json({
      message: `You've successfully created a new acc. Go to login`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    // 1) Get refreshToken from body or cookie
    const refreshToken = req.body.refreshToken || req.cookies["refreshToken"];

    // 2) If data is missing
    if (!refreshToken) throw new CustomError("Refresh token is missing", 400);

    // 3) Refresh access token
    const accessToken = refreshAccessToken(refreshToken);

    // 4) Set new access token to cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 1 * 1000, // 1m
    });

    // 5) Return json
    res.status(201).json({
      message: `You've successfully refreshed token`,
      data: { accessToken },
      success: true,
    });
  } catch (err) {
    next(err);
  }
}
