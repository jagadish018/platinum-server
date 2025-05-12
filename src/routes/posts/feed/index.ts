import { prismaClient } from "../../../integration/prisma";
import { createSecureRoute } from "../../middleware/session-middleware";
import { getPagination } from "../../../extras/pagination";

export const feedRoute = createSecureRoute();


feedRoute.get("", async (context) => {
  const user = context.get("user");

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

feedRoute.delete("/:postId", async (context) => {
  const { postId} = context.req.param();
    const user = context.get("user");
    const post = await prismaClient.post.delete({
      where: {
        id: postId,
        authorId: user.id,
      },
      include: {
        author: true,
      },
    });

    return context.json(post);
   
});


feedRoute.get("/search", async (context) => {
  const { q: query, limit = "10", offset = "0" } = context.req.query();

  const searchResults = await prismaClient.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { text: { contains: query, mode: "insensitive" } },
      ],
    },
    take: parseInt(limit),
    skip: parseInt(offset),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return context.json({
    success: true,
    data: searchResults,
    meta: {
      count: searchResults.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});
