import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../integration/prisma";
import { createUnsecureRoute } from "../middleware/session-middleware";

// Add this new unsecure route for public access
export const unsecureLikes = createUnsecureRoute();

// Public like status endpoint
// Public like status endpoint (unauthenticated)
unsecureLikes.get("/:postId", async (context) => {
  const { postId } = context.req.param();

  const post = await prismaClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }

  const totalLikes = await prismaClient.like.count({
    where: { postId },
  });

  return context.json({
    count: totalLikes
  });
});