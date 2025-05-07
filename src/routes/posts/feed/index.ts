import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../../../integration/prisma";
import { createSecureRoute } from "../../middleware/session-middleware";

export const feedRoute = createSecureRoute();


feedRoute.get("", async (context) => {
    const user = context.get("user");
    const latestPost = await prismaClient.post.findMany({
        include: {
            author: true,
        },
        orderBy: {
            createdAt: "desc",
            },
        take: 10,
    });
    return context.json(latestPost);
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
