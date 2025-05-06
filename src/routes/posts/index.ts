import { zValidator } from "@hono/zod-validator";
import { createSecureRoute } from "../middleware/session-middleware";
import { z } from "zod";
import { prismaClient } from "../../integration/prisma";

export const postRoute = createSecureRoute();

postRoute.post(
  "/",
  zValidator(
    "json",
    z.object({
      text: z.string().min(1, "only non-empty strings are allowed in text"),
    })
  ),
    async (context) => {
        const user =context.get("user");
        const { text } = context.req.valid("json");
        
        const post = await prismaClient.post.create(
            {
                data: {
                    text,
                    authorId: user.id,
                },
            }
        );
        return context.json(post,201);
  }
);
