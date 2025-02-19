import { Response, Request } from "express";

export function notFoundRouteHandler(req: Request, res: Response) {
  res.status(404).json({
    error: "This endpoint doesn't exists",
  });
}
