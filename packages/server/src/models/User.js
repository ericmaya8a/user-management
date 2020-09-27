import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, createHash } from '../utils';

export const ROLES = ['admin', 'super', 'user'];

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name.']
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      required: [true, 'Please add an email'],
      unique: true
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExipre: Date
  },
  {
    timestamps: true
  }
);

const encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Encrypting password
UserSchema.pre('save', async function (next) {
  const isPasswordModified = this.isModified('password');
  if (!isPasswordModified) {
    next();
  }

  this.password = await encryptPassword(this.password);
  next();
});

UserSchema.methods.encryptPassword = async function (password) {
  return encryptPassword(password);
};

// Sign JWT
UserSchema.methods.getSignedJwtToken = function () {
  const { JWT_EXPIRE, SECRET } = process.env;
  return jwt.sign({ id: this._id }, SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Match password
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = generateToken();

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = createHash(resetToken);

  // Set expire
  this.resetPasswordExipre = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default model('User', UserSchema);
