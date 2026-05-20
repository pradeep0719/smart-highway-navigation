import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { formatUser } from '../utils/formatUser.js';

/** Register new user */
export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });
  const tokens = await issueTokens(user);

  res.status(201).json({
    user: formatUser(user),
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

/** Login user */
export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const tokens = await issueTokens(user);

  res.json({
    user: formatUser(user),
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

/** Get current user profile */
export async function getMe(req, res) {
  res.json(formatUser(req.user));
}

/** Refresh access token */
export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
  res.json({ token: accessToken });
}

async function issueTokens(user) {
  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}
