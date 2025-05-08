import { prismaClient } from "../../integration/prisma";
import { createUnsecureRoute } from "../middleware/session-middleware";

export const unSecureComment = createUnsecureRoute();



unSecureComment.get("/:postId", async (context) => {
  const { postId } = context.req.param();
  const post = await prismaClient.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      user: true,
    },
  });
  return context.json(post);
});

unSecureComment.get("/count/:postId", async (context) => {
  const { postId } = context.req.param();
  const count = await prismaClient.comment.count({
    where: {
      postId: postId,
    },
  });
  return context.json(count);
});