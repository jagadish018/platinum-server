import { getPagination } from "../../extras/pagination";
import { prismaClient } from "../../integration/prisma";
import { createUnsecureRoute } from "../middleware/session-middleware";

export const unSecureFeedRoute = createUnsecureRoute();

unSecureFeedRoute.get("", async (context) => {
  // Get pagination parameters
  const { page, limit, skip } = getPagination(context);

  const latestPosts = await prismaClient.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: skip,
  });
 
  return context.json({
    page,
    limit,
    data: latestPosts,
  });
});

