// backend/src/seeds/users.js

import User from '../models/User.js';

/**
 * Seed users data
 */
const seedUsers = async () => {
  try {
    // ========================================================
    // CHECK EXISTING USERS
    // ========================================================

    const count = await User.countDocuments();

    if (count > 0) {
      console.log('⚠️ Users already exist. Skipping...');
      return;
    }

    // ========================================================
    // DEFAULT SEED PASSWORDS
    // ========================================================
    // You can override these from .env when needed.

    const adminPassword =
      process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    const customerPassword =
      process.env.SEED_CUSTOMER_PASSWORD || 'Customer@123';

    // ========================================================
    // USERS
    // ========================================================

    const users = [
      {
        name: 'Admin User',
        email: 'admin@cutiesglowbyrazias.com',
        password: adminPassword,
        phone: '+1 234 567 8900',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
      },

      {
        name: 'John Doe',
        email: 'john@example.com',
        password: customerPassword,
        phone: '+1 234 567 8901',
        role: 'customer',
        isActive: true,
        isEmailVerified: true,

        addresses: [
          {
            label: 'Home',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'US',
            isDefault: true,
          },
        ],
      },

      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: customerPassword,
        phone: '+1 234 567 8902',
        role: 'customer',
        isActive: true,
        isEmailVerified: true,
      },

      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: customerPassword,
        phone: '+1 234 567 8903',
        role: 'customer',
        isActive: true,
        isEmailVerified: false,
      },
    ];

    // ========================================================
    // CREATE USERS
    // ========================================================
    // User.create() triggers the User model's pre-save hook,
    // which hashes the plain password exactly once.

    const createdUsers = await User.create(users);

    // ========================================================
    // LOG RESULTS
    // ========================================================

    console.log(
      `✅ Created ${createdUsers.length} users`
    );

    console.log(
      `   - Admin: ${users[0].email}`
    );

    console.log(
      `   - Customers: ${users
        .slice(1)
        .map((user) => user.email)
        .join(', ')}`
    );

    return createdUsers;
  } catch (error) {
    console.error(
      '❌ Error seeding users:',
      error
    );

    throw error;
  }
};

export default seedUsers;