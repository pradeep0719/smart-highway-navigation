import mongoose from 'mongoose';
import env from '../config/env.js';
import User from '../models/User.js';

/** Seed admin user if not exists */
export async function seedAdmin() {
  const existing = await User.findOne({ email: env.adminEmail });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Promoted ${env.adminEmail} to admin`);
    }
    return;
  }

  await User.create({
    name: 'System Admin',
    email: env.adminEmail,
    password: env.adminPassword,
    role: 'admin',
  });
  console.log(`Admin user created: ${env.adminEmail}`);
}

// Run standalone: npm run seed
if (process.argv[1]?.includes('seed.js')) {
  await mongoose.connect(env.mongodbUri);
  await seedAdmin();
  await mongoose.disconnect();
  process.exit(0);
}
