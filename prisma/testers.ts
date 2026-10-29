// Seeded users that real testers can claim so verifyAuth finds them by firebaseUid.
// Real UIDs/emails come from .env (gitignored) so they never land in git;
// unset vars keep the placeholder values.
export function getTesters() {
  return [
    { placeholderUid: 'firebase-admin-001', uid: process.env.SEED_ADMIN_FIREBASE_UID,     email: process.env.SEED_ADMIN_EMAIL },
    { placeholderUid: 'firebase-vol-001',   uid: process.env.SEED_VOLUNTEER_FIREBASE_UID, email: process.env.SEED_VOLUNTEER_EMAIL },
  ];
}

// Swaps in a tester's real UID/email if this seeded user is claimed.
export function withTester<T extends { firebaseUid: string; email: string }>(data: T): T {
  const tester = getTesters().find((t) => t.placeholderUid === data.firebaseUid);
  return { ...data, firebaseUid: tester?.uid || data.firebaseUid, email: tester?.email || data.email };
}
