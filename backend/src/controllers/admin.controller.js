import User from '../models/User.js';
import NavigationRoute from '../models/NavigationRoute.js';
import { formatUser } from '../utils/formatUser.js';

/** GET /admin/stats */
export async function getStats(_req, res) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [totalUsers, totalRoutes, routesToday] = await Promise.all([
    User.countDocuments(),
    NavigationRoute.countDocuments(),
    NavigationRoute.countDocuments({ createdAt: { $gte: startOfDay } }),
  ]);

  // Active sessions: users active in last 15 minutes
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
  const activeSessions = await User.countDocuments({ lastActiveAt: { $gte: fifteenMinAgo } });

  res.json({
    totalUsers,
    totalRoutes,
    activeSessions,
    routesToday,
  });
}

/** GET /admin/users */
export async function getUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(formatUser));
}

/** PATCH /admin/users/:id/role */
export async function updateUserRole(req, res) {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be user or admin' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(formatUser(user));
}

/** DELETE /admin/users/:id */
export async function deleteUser(req, res) {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(204).send();
}
