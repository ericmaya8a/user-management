import User, { ROLES } from '../models/User';
import {
  createHash,
  ErrorResponse,
  handleErrorType,
  sendTokenResponse
} from '../utils';

/**
 * Register User
 * @name register
 * @route POST /api/v1/auth/register
 * @access public
 */
export const registerUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    handleErrorType(error, res);
  }
};

/**
 * Login User
 * @name login
 * @route POST /api/v1/auth/login
 * @access public
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ErrorResponse(400, 'Please provide an email and password', res);
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ErrorResponse(401, 'Invalid credentials', res);
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ErrorResponse(401, 'Invalid credentials', res);
  }
  sendTokenResponse(user, 200, res);
};

/**
 * Logout
 * @name logout
 * @route GET /api/v1/auth/logout
 * @access private
 */
export const logout = async (req, res, next) => {
  const options = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  };
  res.cookie('token', '', options).json({ success: true });
};

/**
 * Get logged user
 * @name getCurrentUser
 * @route GET /api/v1/auth/user
 * @access private
 */
export const getCurrentUser = async (req, res, next) => {
  res.json({ success: true, data: req.user });
};

/**
 * Update user details
 * @name updateDetails
 * @route PUT /api/v1/auth/updateDetails
 * @access private
 */
export const updateDetails = async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return ErrorResponse(400, 'Please provide name and email', res);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: user });
};

/**
 * Update user password
 * @name updatePassword
 * @route PUT /api/v1/auth/updatePassword
 * @access private
 */
export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return ErrorResponse(400, 'Please provide password and new password', res);
  }

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return ErrorResponse(400, 'Incorrect password', res);
  }

  try {
    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    handleErrorType(error, res);
  }
};

/**
 * Forgot password
 * @name forgotPassword
 * @route POST /api/v1/auth/forgotPassword
 * @access public
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return ErrorResponse(404, `There is no user: ${email}`, res);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset Url
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;

  res.json({ success: true, resetURL });
};

/**
 * Reset password
 * @name resetPassword
 * @route PUT /api/v1/auth/resetPassword/:resetToken
 * @access public
 */
export const resetPassword = async (req, res, next) => {
  const {
    params: { resetToken },
    body: { password }
  } = req;

  // Get hash token
  const resetPasswordToken = createHash(resetToken);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExipre: { $gt: Date.now() }
  });

  if (!user) {
    return ErrorResponse(400, 'Invalid token', res);
  }

  try {
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExipre = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    handleErrorType(error, res);
  }
};

/**
 * Reset password
 * @name getRoles
 * @route PUT /api/v1/auth/getRoles
 * @access public
 */
export const getRoles = async (req, res, next) => {
  const data = ROLES.map((item) => ({
    label: `${item.charAt(0).toUpperCase()}${item.substr(1)}`,
    value: item
  }));
  res.json({ success: true, data });
};
