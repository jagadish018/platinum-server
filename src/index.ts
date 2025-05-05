import { serve } from '@hono/node-server';
import { Hono } from 'hono';


const allRoutes = new Hono();

allRoutes.get('/', (c) => c.text('Hello Hono!'));

serve(allRoutes, ({ port }) => {
  console.log(`Localhost: ${port}`);
});