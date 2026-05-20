/** Transform Mongoose user document to API-safe JSON */
export function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt?.toISOString?.() || user.createdAt,
  };
}
