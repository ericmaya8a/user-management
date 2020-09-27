import crypto from 'crypto';

/**
 * Generate an Error response
 * @param {number} status The number of the status code
 * @param {string} message The error message
 * @param {{status: function, json: function}} res The res server object
 */
const ErrorResponse = (status, message, res) =>
  res.status(status).json({ success: false, message });

/**
 * Get token from module, create cookie and send response
 *
 * @param {{getSignedJwtToken: function}} user The User information and methods
 * @param {number} statusCode The number of the Status code
 * @param {{status: function, cookie: function, json: function}} res The res server object
 */
const sendTokenResponse = (user, statusCode, res) => {
  const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env;
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

/**
 * Handle the error type
 * @param {object} error The error object
 * @param {object} res The res server object
 */
const handleErrorType = (error, res) => {
  // Mongoose Duplicated error
  if (error.code && error.code === 11000) {
    return ErrorResponse(400, 'Duplicate field value entered', res);
  }

  // Mongoose validation error
  if (error.name && error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((item) => item.message);
    return ErrorResponse(400, errors[0], res);
  }

  // Mongoose bad ObjectId
  if (error.name && error.name === 'CastError') {
    return ErrorResponse(404, 'Resource not found', res);
  }

  ErrorResponse(500, 'Internal Server Error', res);
};

/**
 * Create hash
 * @param {string} token The token
 */
const createHash = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateToken = () => crypto.randomBytes(20).toString('hex');

export {
  ErrorResponse,
  createHash,
  generateToken,
  handleErrorType,
  sendTokenResponse
};
