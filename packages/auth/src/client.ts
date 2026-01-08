import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // baseURL: 'http://localhost:3000',
  basePath: '/api/auth',
});

// export type SignIn = ReturnType<(typeof authClient)['signIn']>;

export const { signIn, signUp, useSession } = createAuthClient();
