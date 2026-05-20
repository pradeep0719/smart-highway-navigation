import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/** Sign access token for authenticated user */
export function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/** Sign refresh token */
export function signRefreshToken(payload) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
}

/** Verify access token */
export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

/** Verify refresh token */
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}
