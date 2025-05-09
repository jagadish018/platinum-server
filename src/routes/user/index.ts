import { HTTPException } from "hono/http-exception";
import { createSecureRoute } from "../middleware/session-middleware";
import { prismaClient } from "../../integration/prisma";

export const userRoute = createSecureRoute();
userRoute.get("/me", async (context) => {
  const user = context.get("user");

  const getUser = await prismaClient.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      posts: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc", // Sort posts by creation date in descending order
        },
      },
    },
  });

  if (!getUser) {
    throw new HTTPException(404, {
      message: "User not found",
    });
  }

  return context.json({
    user: getUser,
  });
});

userRoute.patch("/me", async (context) => {
    const user = context.get("user");
    const data = await context.req.json();
    const updateUser = await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            name: data.name,
          about: data.about,
          image: data.image,
            email: data.email,
            
        }
    });
    return context.json({
        user: updateUser
    });
});

