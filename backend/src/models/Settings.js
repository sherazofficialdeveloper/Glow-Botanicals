// backend/src/models/Settings.js

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    // General Settings
    siteName: {
      type: String,
      default: 'Glow Botanical',
    },
    tagline: {
      type: String,
      default: 'Premium Skincare',
    },
    contactEmail: {
      type: String,
      default: 'info@glowbotanical.com',
    },
    contactPhone: {
      type: String,
      default: '+1 (800) 555-GLOW',
    },
    address: {
      type: String,
      default: '',
    },

    // PayPal Settings
    paypalClientId: {
      type: String,
      default: '',
    },
    paypalSecret: {
      type: String,
      default: '',
      select: false,
    },
    paypalMode: {
      type: String,
      enum: ['sandbox', 'live'],
      default: 'sandbox',
    },
    paypalEnabled: {
      type: Boolean,
      default: true,
    },
    codEnabled: {
      type: Boolean,
      default: true,
    },
    codInstructions: {
      type: String,
      default: '',
    },
    defaultPaymentMethod: {
      type: String,
      default: 'paypal',
    },

    // Shipping Settings
    freeShippingThreshold: {
      type: Number,
      default: 35,
    },
    standardShippingCost: {
      type: Number,
      default: 5.99,
    },
    expressShippingCost: {
      type: Number,
      default: 12.99,
    },
    internationalShippingCost: {
      type: Number,
      default: 24.99,
    },
    availableCountries: {
      type: String,
      default: 'US, CA, GB, PK',
    },
    estimatedDeliveryDays: {
      type: String,
      default: '3-5 business days',
    },

    // Tax Settings
    taxRate: {
      type: Number,
      default: 8,
    },

    // Currency Settings
    currency: {
      type: String,
      default: 'USD',
    },
    currencySymbol: {
      type: String,
      default: '$',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;