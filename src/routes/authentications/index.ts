import { betterAuthClient } from '../../integration/better-auth';
import { createUnsecureRoute } from '../middleware/session-middleware';

export const authenticationsRoute = createUnsecureRoute();

 
authenticationsRoute.use((c) => {
    return betterAuthClient.handler(c.req.raw);
})