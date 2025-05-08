import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { authenticationsRoute } from './routes/authentications';
import { cors } from 'hono/cors';
import { webClientUrl } from './utils/environment';
import { postsRoute, unSecurePostsRoute } from './routes/posts';
import { feedRoute } from './routes/posts/feed';
import { userRoute } from './routes/user';
import { likesRoute } from './routes/likes';
import { commentRoute } from './routes/comments';


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
allRoutes.use('*', logger());
allRoutes.route("/authentication", authenticationsRoute);
allRoutes.route("/posts", postsRoute);
allRoutes.route("/posts", unSecurePostsRoute);
allRoutes.route("/feeds", feedRoute);
allRoutes.route("/users", userRoute);
allRoutes.route("/likes", likesRoute);
allRoutes.route("/comments", commentRoute);

serve(allRoutes, ({ port }) => {
  console.log(`Running at http//:localhost:${port}`);
});