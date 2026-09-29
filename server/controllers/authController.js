const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function safeEqual(a, b) {
  const aBuf = Buffer.from(String(a));
  const bBuf = Buffer.from(String(b));
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

exports.login = (req, res) => {
  const { login, password } = req.body || {};
  const expectedLogin = process.env.AUTH_LOGIN;
  const expectedPassword = process.env.AUTH_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!expectedLogin || !expectedPassword || !jwtSecret) {
    return res.status(500).json({ message: 'Server auth is not configured' });
  }

  if (
    typeof login !== 'string' ||
    typeof password !== 'string' ||
    !safeEqual(login, expectedLogin) ||
    !safeEqual(password, expectedPassword)
  ) {
    return res.status(401).json({ message: 'Invalid login credentials' });
  }

  const token = jwt.sign({ login: expectedLogin }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return res.json({ token, login: expectedLogin });
};

exports.me = (req, res) => {
  return res.json({ login: req.user.login });
};
