import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authenticationsRoute } from "./routes/authentications";
import { cors } from "hono/cors";
import { webClientUrl } from "./utils/environment";
import { feedRoute } from "./routes/posts/feed";
import { userRoute } from "./routes/user";
import { likesRoute } from "./routes/likes";
import { commentRoute } from "./routes/comments";
import { unSecurePostsRoute } from "./routes/UnsecurePost";
import { postsRoute } from "./routes/posts";
import { unSecureFeedRoute } from "./routes/unSecureFeed";
import { unSecureComment } from "./routes/unSecureComments";
import { unSecureUserRoute } from "./routes/unSecureUser";
import { unsecureLikes } from "./routes/unSecureLike";

const allRoutes = new Hono();

const apiRoutes = new Hono();

allRoutes.use(
  cors({
    origin: webClientUrl,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  })
);
allRoutes.route("/server", apiRoutes);

apiRoutes.use("*", logger());
apiRoutes.route("/authentication", authenticationsRoute);
apiRoutes.route("/posts", unSecurePostsRoute);
apiRoutes.route("/feeds", unSecureFeedRoute);
apiRoutes.route("/comments", unSecureComment);
apiRoutes.route("/public/likes", unsecureLikes);
apiRoutes.route("/users-profile", unSecureUserRoute);
apiRoutes.route("/posts", postsRoute);
apiRoutes.route("/feeds", feedRoute);
apiRoutes.route("/profile", userRoute);
apiRoutes.route("/likes", likesRoute);
apiRoutes.route("/comments", commentRoute);

serve(allRoutes, ({ port }) => {
  console.log(`Running at http//:localhost:${port}`);
});
