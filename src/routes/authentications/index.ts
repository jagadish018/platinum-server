import { betterAuthClient } from '../../integration/better-auth';
import { createUnsecureRoute } from '../middleware/session-middleware';

export const authenticationsRoute = createUnsecureRoute();

 
authenticationsRoute.all("/**", async (c) => {
  return await betterAuthClient.handler(c.req.raw);
});