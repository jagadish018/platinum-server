import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { authenticationsRoute } from './routes/authentications';
import { cors } from 'hono/cors';
import { webClientUrl } from './utils/environment';


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


serve(allRoutes, ({ port }) => {
  console.log(`http//:localhost:${port}`);
});