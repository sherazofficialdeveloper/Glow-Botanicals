import mongoose from 'mongoose';
import crypto from 'crypto';

import User from '../models/User.js';

import { generateToken } from '../config/jwt.js';
import { comparePassword } from '../utils/password.js';
import { AppError } from '../utils/error.js';
import logger from '../utils/logger.js';
import { normalizeEmail } from '../utils/helpers.js';
import { sendOTPEmail, sendPasswordResetEmail, sendWelcomeEmailInBackground, sendLoginNotificationInBackground } from './emailService.js';
import { deleteImage } from '../utils/cloudinaryUpload.js';

const validateUserId = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError('Invalid user ID', 400);
  }
};

const getSafeUser = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    avatar: user.avatar || '',
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    addresses: user.addresses || [],
    preferences: user.preferences || {},
    lastLogin: user.lastLogin || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// ============================================================
// REGISTER
// ============================================================

export const registerUser = async (userData) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = userData;

    const normalizedEmail = normalizeEmail(email);

    if (!name?.trim()) {
      throw new AppError(
        'Name is required',
        400
      );
    }

    if (!normalizedEmail) {
      throw new AppError(
        'Email is required',
        400
      );
    }

    if (!password) {
      throw new AppError(
        'Password is required',
        400
      );
    }

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      throw new AppError(
        'User already exists with this email',
        409
      );
    }

    // IMPORTANT:
    // Password ko yahan hash nahi karna.
    // User model ka pre-save hook automatically
    // plain password ko hash karega.

    const user = new User({
      name: String(name).trim(),

      email: normalizedEmail,

      password,

      phone:
        phone !== undefined
          ? String(phone).trim()
          : '',
      
      role: 'customer',

      isActive: true,

      isEmailVerified: false,
    });

    await user.save();

    sendWelcomeEmailInBackground(user);

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: getSafeUser(user),
      token,
    };
  } catch (error) {
    logger.error(
      `Register service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
  email,
  password
) => {
  try {
    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail || !password) {
      throw new AppError(
        'Email and password are required',
        400
      );
    }

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select('+password');

    if (!user) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    if (user.isActive === false) {
      throw new AppError(
        'Account has been deactivated. Please contact support.',
        403
      );
    }

    const isMatch =
      await comparePassword(
        password,
        user.password
      );

    if (!isMatch) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    user.lastLogin = new Date();

    await user.save();

    sendLoginNotificationInBackground(user);

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: getSafeUser(user),
      token,
    };
  } catch (error) {
    logger.error(
      `Login service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// GET USER BY ID
// ============================================================

export const getUserById = async (
  userId
) => {
  try {
    validateUserId(userId);

    const user =
      await User.findById(userId)
        .select('-password');

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    if (user.isActive === false) {
      throw new AppError(
        'Account has been deactivated',
        403
      );
    }

    return getSafeUser(user);
  } catch (error) {
    logger.error(
      `Get user service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// UPDATE PROFILE
// ============================================================

export const updateUserProfile = async (
  userId,
  updateData
) => {
  try {
    validateUserId(userId);

    const user =
      await User.findById(userId);

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    if (user.isActive === false) {
      throw new AppError(
        'Account has been deactivated',
        403
      );
    }

    const {
      name,
      phone,
      avatar,
      notificationPreferences,
    } = updateData;

    if (name !== undefined) {
      const trimmedName =
        String(name).trim();

      if (!trimmedName) {
        throw new AppError(
          'Name cannot be empty',
          400
        );
      }

      user.name = trimmedName;
    }

    if (phone !== undefined) {
      user.phone =
        String(phone).trim();
    }

    if (avatar !== undefined) {
      user.avatar =
        String(avatar).trim();
    }

    if (notificationPreferences !== undefined && typeof notificationPreferences === 'object') {
      const allowedKeys = ['orderUpdates', 'promotions', 'reviews'];
      if (!user.preferences) user.preferences = {};
      if (!user.preferences.notifications) user.preferences.notifications = {};
      for (const key of allowedKeys) {
        if (typeof notificationPreferences[key] === 'boolean') {
          user.preferences.notifications[key] = notificationPreferences[key];
        }
      }
      user.markModified('preferences');
    }

    await user.save();

    return getSafeUser(user);
  } catch (error) {
    logger.error(
      `Update profile service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// UPDATE AVATAR
// ============================================================

export const updateUserAvatar = async (userId, url, publicId) => {
  try {
    validateUserId(userId);

    const user = await User.findById(userId).select('+avatarPublicId');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const previousPublicId = user.avatarPublicId;

    user.avatar = url;
    user.avatarPublicId = publicId;
    await user.save();

    // Clean up the previous Cloudinary asset now that the new one is
    // safely saved — non-fatal if it fails, the user's update already
    // succeeded either way.
    if (previousPublicId && previousPublicId !== publicId) {
      try {
        await deleteImage(previousPublicId);
      } catch (error) {
        logger.error(`Failed to delete previous avatar (${previousPublicId}): ${error.message}`);
      }
    }

    return getSafeUser(user);
  } catch (error) {
    logger.error(`Update avatar service error: ${error.message}`);
    throw error;
  }
};

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  try {
    validateUserId(userId);

    if (!currentPassword || !newPassword) {
      throw new AppError(
        'Current password and new password are required',
        400
      );
    }

    if (newPassword.length < 6) {
      throw new AppError(
        'New password must be at least 6 characters long',
        400
      );
    }

    const user =
      await User.findById(userId)
        .select('+password');

    if (!user) {
      throw new AppError(
        'User not found',
        404
      );
    }

    if (user.isActive === false) {
      throw new AppError(
        'Account has been deactivated',
        403
      );
    }

    const currentPasswordMatch =
      await comparePassword(
        currentPassword,
        user.password
      );

    if (!currentPasswordMatch) {
      throw new AppError(
        'Current password is incorrect',
        401
      );
    }

    const samePassword =
      await comparePassword(
        newPassword,
        user.password
      );

    if (samePassword) {
      throw new AppError(
        'New password cannot be the same as the current password',
        400
      );
    }

    // Plain password assign karein.
    // User model pre-save hook hash karega.
    user.password = newPassword;

    await user.save();

    return true;
  } catch (error) {
    logger.error(
      `Change password service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// LEGACY PASSWORD RESET
// GENERATE RESET TOKEN
// ============================================================

export const generateResetToken = async (
  email
) => {
  try {
    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail) {
      throw new AppError(
        'Email is required',
        400
      );
    }

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user || user.isActive === false) {
      return { success: true };
    }

    const resetToken =
      user.generatePasswordResetToken();

    await user.save();

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      logger.error(`Reset email failed: ${emailError.message}`);
    }

    return {
      resetToken,
    };
  } catch (error) {
    logger.error(
      `Generate reset token service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// LEGACY PASSWORD RESET
// RESET PASSWORD
// ============================================================

export const resetUserPassword = async (
  token,
  newPassword
) => {
  try {
    if (!token?.trim()) {
      throw new AppError(
        'Reset token is required',
        400
      );
    }

    if (!newPassword) {
      throw new AppError(
        'New password is required',
        400
      );
    }

    if (newPassword.length < 6) {
      throw new AppError(
        'Password must be at least 6 characters long',
        400
      );
    }

    const user =
      await User.findOne({
        resetPasswordToken:
          token.trim(),

        resetPasswordExpires: {
          $gt: Date.now(),
        },
      }).select('+password');

    if (!user) {
      throw new AppError(
        'Invalid or expired reset token',
        400
      );
    }

    if (user.isActive === false) {
      throw new AppError(
        'Account has been deactivated',
        403
      );
    }

    const samePassword =
      await comparePassword(
        newPassword,
        user.password
      );

    if (samePassword) {
      throw new AppError(
        'New password cannot be the same as the old password',
        400
      );
    }

    // Plain password.
    // Model pre-save hook hashes it.
    user.password = newPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpires =
      undefined;

    await user.save();

    return {
      success: true,
      message:
        'Password reset successfully',
    };
  } catch (error) {
    logger.error(
      `Reset password service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// OTP PASSWORD RESET
// SEND OTP
// ============================================================

export const sendPasswordResetOTP = async (
  email
) => {
  try {
    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail) {
      throw new AppError(
        'Email is required',
        400
      );
    }

    const genericResponse = {
      success: true,
      message:
        'If an account exists for this email, an OTP has been sent',
    };

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select(
        '+resetPasswordOTP +resetPasswordOTPExpires +resetPasswordOTPCooldown'
      );

    if (!user || user.isActive === false) {
      return genericResponse;
    }

    if (
      user.resetPasswordOTPCooldown &&
      user.resetPasswordOTPCooldown >
        Date.now()
    ) {
      throw new AppError(
        'Please wait before requesting another OTP',
        429
      );
    }

    const otp =
      user.generateResetPasswordOTP();

    user.resetPasswordOTPCooldown =
      Date.now() + 60 * 1000;

    await user.save();

    await sendOTPEmail(
      user,
      otp
    );

    return genericResponse;
  } catch (error) {
    logger.error(
      `Send OTP service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// OTP PASSWORD RESET
// VERIFY OTP + RESET PASSWORD
// ============================================================

export const verifyOTPAndResetPassword =
  async (
    email,
    otp,
    newPassword
  ) => {
    try {
      const normalizedEmail =
        normalizeEmail(email);

      if (!normalizedEmail) {
        throw new AppError(
          'Email is required',
          400
        );
      }

      if (!otp) {
        throw new AppError(
          'OTP is required',
          400
        );
      }

      if (!newPassword) {
        throw new AppError(
          'New password is required',
          400
        );
      }

      if (newPassword.length < 6) {
        throw new AppError(
          'Password must be at least 6 characters long',
          400
        );
      }

      const user =
        await User.findOne({
          email: normalizedEmail,
        }).select(
          '+password +resetPasswordOTP +resetPasswordOTPExpires'
        );

      if (!user) {
        throw new AppError(
          'User not found',
          404
        );
      }

      if (user.isActive === false) {
        throw new AppError(
          'Account has been deactivated. Please contact support.',
          403
        );
      }

      const isValidOTP =
        user.isResetPasswordOTPValid(
          String(otp).trim()
        );

      if (!isValidOTP) {
        throw new AppError(
          'Invalid or expired OTP',
          400
        );
      }

      const samePassword =
        await comparePassword(
          newPassword,
          user.password
        );

      if (samePassword) {
        throw new AppError(
          'New password cannot be the same as the old password',
          400
        );
      }

      // Plain password.
      // Model pre-save hook hashes it.
      user.password =
        newPassword;

      // Clear OTP data after successful reset.
      user.resetPasswordOTP =
        undefined;

      user.resetPasswordOTPExpires =
        undefined;

      user.resetPasswordOTPCooldown =
        undefined;

      // Also invalidate any legacy reset token.
      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpires =
        undefined;

      await user.save();

      return {
        success: true,
        message:
          'Password reset successfully',
      };
    } catch (error) {
      logger.error(
        `Verify OTP service error: ${error.message}`
      );

      throw error;
    }
  };

// ============================================================
// RESEND OTP
// ============================================================

export const resendPasswordResetOTP =
  async (email) => {
    return sendPasswordResetOTP(
      email
    );
  };

// ============================================================
// VERIFY EMAIL
// ============================================================

export const verifyEmail = async (
  token
) => {
  try {
    if (!token?.trim()) {
      throw new AppError(
        'Verification token is required',
        400
      );
    }

    const user =
      await User.findOne({
        emailVerificationToken:
          token.trim(),
      });

    if (!user) {
      throw new AppError(
        'Invalid verification token',
        400
      );
    }

    if (user.isActive === false) {
      throw new AppError(
        'Account has been deactivated',
        403
      );
    }

    user.isEmailVerified = true;

    user.emailVerificationToken =
      undefined;

    await user.save();

    return {
      success: true,
      message:
        'Email verified successfully',
    };
  } catch (error) {
    logger.error(
      `Verify email service error: ${error.message}`
    );

    throw error;
  }
};

// ============================================================
// GENERATE EMAIL VERIFICATION TOKEN
// ============================================================

export const generateEmailVerificationToken =
  async (userId) => {
    try {
      validateUserId(userId);

      const user =
        await User.findById(userId);

      if (!user) {
        throw new AppError(
          'User not found',
          404
        );
      }

      const token =
        crypto
          .randomBytes(32)
          .toString('hex');

      user.emailVerificationToken =
        token;

      await user.save();

      return token;
    } catch (error) {
      logger.error(
        `Generate email verification token error: ${error.message}`
      );

      throw error;
    }
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  changeUserPassword,

  // Legacy reset
  generateResetToken,
  resetUserPassword,

  // OTP reset
  sendPasswordResetOTP,
  verifyOTPAndResetPassword,
  resendPasswordResetOTP,

  // Email verification
  verifyEmail,
  generateEmailVerificationToken,
};