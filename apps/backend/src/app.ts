import { auth } from '@workspace/auth/server';
import { config } from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

config({ path: '.env.local' });

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(logger());

app.use(
  '/api/auth/*', // or replace with "*" to enable cors for all routes
  cors({
    origin: 'http://localhost:3001', // replace with your origin
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set('user', null);
    c.set('session', null);
    await next();
    return;
  }
  c.set('user', session.user);
  c.set('session', session.session);
  await next();
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  // console.log('Handling auth route:', c.req.raw);
  return auth.handler(c.req.raw);
});

app.get('/session', (c) => {
  const session = c.get('session');
  const user = c.get('user');

  if (!user) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

app.get('/', (c) => c.text('Backend is up'));
app.get('/healthz', (c) => c.json({ status: 'ok' }));
app.get('/api/hello', (c) => c.json({ message: 'Hello from Hono' }));

export { app };
