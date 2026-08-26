// backend/src/models/Order.js

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Authenticated customer
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Items purchased
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shipping: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },

    shippingAddress: {
      name: {
        type: String,
        required: true,
        trim: true,
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
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ['paypal', 'stripe', 'cod', 'afterpay', 'klarna'],
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentProviderOrderId: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'rejected',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email',
      ],
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      maxlength: 500,
      default: '',
      trim: true,
    },

    trackingNumber: {
      type: String,
      default: '',
      trim: true,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    // Actual searchable order number
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// INDEXES
// ============================================================

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customerEmail: 1 });

// ============================================================
// GENERATE ORDER NUMBER
// ============================================================

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber && this._id) {
    this.orderNumber = this._id
      .toString()
      .slice(-6)
      .toUpperCase();
  }

  next();
});

// ============================================================
// STATUS DATE HANDLING
// ============================================================

orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'shipped' && !this.shippedAt) {
      this.shippedAt = new Date();
    }

    if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
  }

  next();
});

// ============================================================
// JSON TRANSFORM
// ============================================================

orderSchema.set('toJSON', {
  virtuals: true,

  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;