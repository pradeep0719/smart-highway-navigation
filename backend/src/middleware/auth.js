import User from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { asyncHandler } from './errorHandler.js';

/** Require valid JWT — attaches req.user */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    const err = new Error('Authentication required');
    err.statusCode = 401;
    throw err;
  }

  const token = header.slice(7);
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    const err = new Error('Invalid or expired token');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    throw err;
  }

  // Track activity for admin stats
  user.lastActiveAt = new Date();
  await user.save({ validateBeforeSave: false });

  req.user = user;
  next();
});

/** Require admin role */
export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    const err = new Error('Admin access required');
    err.statusCode = 403;
    return next(err);
  }
  next();
};
