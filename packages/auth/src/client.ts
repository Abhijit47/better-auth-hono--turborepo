import { adminClient, lastLoginMethodClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, admin, myCustomRole, user } from './permissions';

export const authClient = createAuthClient({
  // baseURL: 'http://localhost:3000',
  basePath: '/api/auth',
  plugins: [
    adminClient({
      ac,
      roles: { admin, user, myCustomRole },
    }),
    lastLoginMethodClient(),
  ],
});

// export type SignIn = ReturnType<(typeof authClient)['signIn']>;

export const { signIn, signUp, useSession } = createAuthClient();
