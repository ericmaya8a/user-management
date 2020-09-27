import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ErrorResponse } from '../utils';

export const protect = async (req, res, next) => {
  let token = null;
  const { cookies } = req;
  if (cookies.token && cookies.token.length) {
    token = cookies.token;
  }

  // Validate token exists
  if (!token) {
    return ErrorResponse(401, 'Not authorized', res);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return ErrorResponse(401, 'Not authorized', res);
  }
};

export const authorize = (roles) => (req, res, next) => {
  const { role } = req.user;

  if (!roles.includes(role)) {
    return ErrorResponse(
      403,
      `User with the role: "${role}" is not authorized to access this route`,
      res
    );
  }
  next();
};
