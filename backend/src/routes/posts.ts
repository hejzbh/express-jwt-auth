import { Router } from "express";
import { cacheCheck } from "@/middlewares/cacheCheck.js";
import { redis } from "@/lib/redis.js";

const router = Router();

async function getPosts() {
  return await new Promise((res) => {
    setTimeout(() => {
      res([
        { id: 1, name: "Dummy post 1" },
        { id: 2, name: "Dummy post 2" },
        { id: 3, name: "Dummy post 3" },
        { id: 4, name: "Dummy post 4" },
        { id: 5, name: "Dummy post 5" },
      ]);
    }, 1000);
  });
}

router.get("/", cacheCheck({ key: "new_posts" }), async (req, res, next) => {
  try {
    /**if (!(req as RequestWithUser).user)
      throw new CustomError("Unauthorized", 401); */

    const posts = getPosts();

    await redis.set("new_posts", JSON.stringify(posts), { EX: 60 * 60 * 3 });

    res.status(200).json({
      message: "Successfully fetched posts",
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
