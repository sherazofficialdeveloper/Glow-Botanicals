// backend/src/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    // ========================================================
    // BASIC INFORMATION
    // ========================================================

    name: {
      type: String,
      required: [
        true,
        'Name is required',
      ],
      trim: true,
      minlength: [
        2,
        'Name must be at least 2 characters long',
      ],
      maxlength: [
        50,
        'Name cannot exceed 50 characters',
      ],
    },

    email: {
      type: String,
      required: [
        true,
        'Email is required',
      ],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [
        true,
        'Password is required',
      ],
      minlength: [
        6,
        'Password must be at least 6 characters long',
      ],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: '',
    },

    avatar: {
      type: String,
      default: '',
    },

    avatarPublicId: {
      type: String,
      default: '',
      select: false,
    },

    // ========================================================
    // ROLE
    // ========================================================

    role: {
      type: String,
      enum: [
        'admin',
        'customer',
      ],
      default: 'customer',
    },

    // ========================================================
    // ADDRESSES
    // ========================================================

    addresses: [
      {
        label: {
          type: String,
          enum: [
            'Home',
            'Work',
            'Other',
          ],
          default: 'Home',
        },

        street: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        zip: {
          type: String,
          required: true,
          trim: true,
        },

        country: {
          type: String,
          default: 'US',
          trim: true,
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ========================================================
    // STATUS
    // ========================================================

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    // ========================================================
    // OTP PASSWORD RESET
    // ========================================================

    resetPasswordOTP: {
      type: String,
      select: false,
    },

    resetPasswordOTPExpires: {
      type: Date,
      select: false,
    },

    resetPasswordOTPCooldown: {
      type: Date,
      select: false,
    },

    // ========================================================
    // LEGACY PASSWORD RESET
    // ========================================================

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },

    // ========================================================
    // LOGIN
    // ========================================================

    lastLogin: {
      type: Date,
      default: null,
    },

    // ========================================================
    // PREFERENCES
    // ========================================================

    preferences: {
      currency: {
        type: String,
        default: 'USD',
      },

      language: {
        type: String,
        default: 'en',
      },

      newsletter: {
        type: Boolean,
        default: false,
      },

      notifications: {
        orderUpdates: {
          type: Boolean,
          default: true,
        },
        promotions: {
          type: Boolean,
          default: false,
        },
        reviews: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// HASH PASSWORD
// ============================================================

userSchema.pre(
  'save',
  async function (next) {
    if (
      !this.isModified(
        'password'
      )
    ) {
      return next();
    }

    try {
      const salt =
        await bcrypt.genSalt(10);

      this.password =
        await bcrypt.hash(
          this.password,
          salt
        );

      next();
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================
// COMPARE PASSWORD
// ============================================================

userSchema.methods.comparePassword =
  async function (
    candidatePassword
  ) {
    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

// ============================================================
// GENERATE OTP
// ============================================================

userSchema.methods.generateResetPasswordOTP =
  function () {
    const otp =
      Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();

    this.resetPasswordOTP =
      crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    this.resetPasswordOTPExpires =
      Date.now() +
      10 * 60 * 1000;

    return otp;
  };

// ============================================================
// CHECK OTP
// ============================================================

userSchema.methods.isResetPasswordOTPValid =
  function (otp) {
    const hashed = crypto
      .createHash('sha256')
      .update(String(otp))
      .digest('hex');

    return (
      this.resetPasswordOTP === hashed &&
      this.resetPasswordOTPExpires &&
      this.resetPasswordOTPExpires > Date.now()
    );
  };

// ============================================================
// LEGACY RESET TOKEN
// ============================================================

userSchema.methods.generatePasswordResetToken =
  function () {
    const token =
      crypto
        .randomBytes(20)
        .toString('hex');

    this.resetPasswordToken =
      token;

    this.resetPasswordExpires =
      Date.now() +
      60 * 60 * 1000;

    return token;
  };

// ============================================================
// EMAIL VERIFICATION TOKEN
// ============================================================

userSchema.methods.generateEmailVerificationToken =
  function () {
    const token =
      crypto
        .randomBytes(20)
        .toString('hex');

    this.emailVerificationToken =
      token;

    return token;
  };

// ============================================================
// JSON TRANSFORM
// ============================================================

userSchema.set(
  'toJSON',
  {
    transform: function (
      doc,
      ret
    ) {
      delete ret.password;
      delete ret.__v;

      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;

      delete ret.resetPasswordOTP;
      delete ret.resetPasswordOTPExpires;
      delete ret.resetPasswordOTPCooldown;

      delete ret.emailVerificationToken;

      return ret;
    },
  }
);

const User =
  mongoose.model(
    'User',
    userSchema
  );

export default User;