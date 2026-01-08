import { auth } from '@workspace/auth/server';
import { Hono } from 'hono';

const appAuth = new Hono();

appAuth.on(['POST', 'GET'], '/api/auth/*', (c) => {
  // console.log('Handling auth route:', c.req.raw);
  return auth.handler(c.req.raw);
});
