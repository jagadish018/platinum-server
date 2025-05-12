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


allRoutes.use("*", logger());
allRoutes.route("/authentication", authenticationsRoute);
allRoutes.route("/posts", unSecurePostsRoute);
allRoutes.route("/unsecure/feeds", unSecureFeedRoute);
allRoutes.route("/unsecure/comments", unSecureComment);
allRoutes.route("/unsecure/likes", unsecureLikes);
allRoutes.route("/users-profile", unSecureUserRoute);
allRoutes.route("/posts", postsRoute);
allRoutes.route("/feeds", feedRoute);
allRoutes.route("/profile", userRoute);
allRoutes.route("/likes", likesRoute);
allRoutes.route("/comments", commentRoute);

serve(allRoutes, ({ port }) => {
  console.log(`Running at http//:localhost:${port}`);
});
