import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../integration/prisma";
import { createUnsecureRoute } from "../middleware/session-middleware";

// Add this new unsecure route for public access
export const unsecureLikes = createUnsecureRoute();

// Public like status endpoint
unsecureLikes.get("/:postId", async (context) => {
  const { postId } = context.req.param();
  
  // Verify post exists
  const post = await prismaClient.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }

  // Get total likes count
  const totalLikes = await prismaClient.like.count({
    where: { postId },
  });

  // Return public data (always liked: false for unauthenticated users)
  return context.json({
    liked: false,
    count: totalLikes,
  });
});