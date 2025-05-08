import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../integration/prisma";
import { createUnsecureRoute } from "../middleware/session-middleware";


 export const unsSecureLikes =  createUnsecureRoute();
unsSecureLikes.get("/:postId", async (context) => {
  const { postId } = context.req.param();
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
