// TODO: Replace with real Firebase Auth implementation.
// Use the Firebase Admin SDK to verify ID tokens and look up users in the DB.

export interface AuthUser {
  uid: string;
  email: string;
  role: 'ADMIN' | 'VOLUNTEER';
}

const MOCK_ADMIN: AuthUser = {
  uid: 'mock-uid',
  email: 'admin@anabelsgrocery.com',
  role: 'ADMIN',
};

/**
 * Verifies that a request is authenticated.
 * TODO: Extract the Firebase ID token from the Authorization header,
 *       call admin.auth().verifyIdToken(token), then load the user from DB.
 */
export async function verifyAuth(_request: Request): Promise<AuthUser> {
  return MOCK_ADMIN;
}

/**
 * Verifies that a request is authenticated and the user has ADMIN role.
 * TODO: Call verifyAuth, then check user.role === 'ADMIN', throw 403 if not.
 */
export async function verifyAdmin(_request: Request): Promise<AuthUser> {
  return MOCK_ADMIN;
}
