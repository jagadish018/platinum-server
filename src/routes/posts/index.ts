import { zValidator } from "@hono/zod-validator";
import { createSecureRoute, createUnsecureRoute } from "../middleware/session-middleware";
import { z } from "zod";
import { prismaClient } from "../../integration/prisma";
import { HTTPException } from "hono/http-exception";

export const postsRoute = createSecureRoute();

postsRoute.post(
  "/",
  zValidator(
    "json",
      z.object({
        title: z.string().min(1, "only non-empty strings are allowed in text"),
        text: z.string().min(1, "only non-empty strings are allowed in text"),
        
    })
  ),
    async (context) => {
        const user =context.get("user");
        const { title,text } = context.req.valid("json");
        
        const post = await prismaClient.post.create(
            {
                data: {
                    title,
                    text,
                    authorId: user.id,
                },
                include: {
                    author: true,
                }
            }
        );
        return context.json(post,201);
  }
);

export const unSecurePostsRoute = createUnsecureRoute();

unSecurePostsRoute.get("/:postId", async (context) => {
  const { postId } = context.req.param();
  const post = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
    },
  });
  if (!post) {
    throw new HTTPException(404);
  }
  return context.json(post);
});