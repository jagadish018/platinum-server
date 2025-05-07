import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../integration/prisma";
import { createSecureRoute } from "../middleware/session-middleware";

export const likesRoute = createSecureRoute();

likesRoute.post("/:postId", async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    const post = await prismaClient.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            author: true,
        },
    });
    if (!post) {
        throw new HTTPException(404, {
            message: "Post not found",
        });
    }
    const like = await prismaClient.like.create({
        data: {
            postId,
            userId: user.id,
        },
    });
    return context.json(like);
});

likesRoute.get("/:postId", async (context) => {
  const { postId } = context.req.param();
  const user = context.get("user");

  const post = await prismaClient.post.findUnique({
    where: { id: postId },
    include: { author: true },
  });

  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }

  const like = await prismaClient.like.findFirst({
    where: {
      postId,
      userId: user.id,
    },
  });

  const totalLikes = await prismaClient.like.count({
    where: { postId },
  });

  return context.json({
    liked: !!like,
    count: totalLikes,
  });
});

likesRoute.delete("/:postId", async (context) => {
    const { postId } = context.req.param();
    const user = context.get("user");
    const post = await prismaClient.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            author: true,
        },
    });
    if (!post) {
        throw new HTTPException(404, {
            message: "Post not found",
        });
    }
    const like = await prismaClient.like.delete({
        where: {
            postId_userId: {
                postId,
                userId: user.id,
            },
        },
    });
    return context.json(like);
});