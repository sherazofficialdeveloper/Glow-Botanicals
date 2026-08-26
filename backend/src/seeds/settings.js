// backend/src/seeds/settings.js

import Settings from '../models/Settings.js';

/**
 * Seed settings data
 */
const seedSettings = async () => {
  try {
    // Check if settings already exist
    const count = await Settings.countDocuments();
    if (count > 0) {
      console.log('⚠️  Settings already exist. Skipping...');
      return;
    }

    const settings = {
      // General Settings
      siteName: 'Glow Botanical',
      tagline: 'Premium Skincare for Radiant Skin',
      contactEmail: 'info@glowbotanical.com',
      contactPhone: '+1 (800) 555-GLOW',
      address: '',

      // PayPal Settings
      paypalClientId: '',
      paypalSecret: '',
      paypalMode: 'sandbox',

      // Shipping Settings
      freeShippingThreshold: 35,
      standardShippingCost: 5.99,
      expressShippingCost: 12.99,
      availableCountries: 'US, CA, GB, PK',
      estimatedDeliveryDays: '3-5 business days',

      // Tax Settings
      taxRate: 8,

      // Currency Settings
      currency: 'USD',
      currencySymbol: '$',
    };

    const created = await Settings.create(settings);
    console.log('✅ Settings seeded');

    return created;
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    throw error;
  }
};

export default seedSettings;