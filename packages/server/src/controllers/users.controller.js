import User from '../models/User';
import { ErrorResponse, handleErrorType, sendTokenResponse } from '../utils';

/**
 * Get Users
 * @name getUsers
 * @route GET /api/v1/users
 * @access private
 */
export const getUsers = async (req, res, next) => {
  const users = await User.find();
  res.json({ success: true, count: users.length, data: users });
};

/**
 * Get Users
 * @name getUser
 * @route GET /api/v1/users/:userId
 * @access private
 */
export const getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return ErrorResponse(404, `No user found with the ID: ${userId}`, res);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    handleErrorType(error, res);
  }
};

/**
 * Create User
 * @name createUser
 * @route POST /api/v1/users
 * @access private
 */
export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    handleErrorType(error, res);
  }
};

/**
 * Update User
 * @name updateUser
 * @route PUT /api/v1/users/:userId
 * @access private
 */
export const updateUser = async (req, res, next) => {
  const {
    user,
    params: { userId },
    body
  } = req;
  const isCurrentUser = user._id.toString() === userId;

  try {
    if (isCurrentUser || user.role === 'admin') {
      // Only "Super" users can update the role
      if (user.role !== 'super') {
        delete body.role;
      }
      if (body.password) {
        // Only change the password if is the same user
        if (isCurrentUser) {
          body.password = await user.encryptPassword(body.password);
        } else {
          delete body.password;
        }
      }
      const updatedUser = await User.findByIdAndUpdate(userId, body, {
        new: true,
        runValidators: true
      });
      return res.json({ success: true, data: updatedUser });
    }
    ErrorResponse(401, 'Unauthorized', res);
  } catch (error) {
    handleErrorType(error, res);
  }
};

/**
 * Delete User
 * @name deleteUser
 * @route DELETE /api/v1/users/:userId
 * @access private
 */
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndRemove(userId);
    res.json({
      success: true,
      message: `The user: "${user.email}" was succssefully deleted`
    });
  } catch (error) {
    handleErrorType(error, res);
  }
};
