import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const migrateUserRoles = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grandma-recipes';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Migrate admin role to sysadmin
    const result = await db.collection('users').updateMany(
      { role: 'admin' },
      { $set: { role: 'sysadmin' } }
    );

    console.log(`Migrated ${result.modifiedCount} users from 'admin' to 'sysadmin' role`);

    await mongoose.disconnect();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUserRoles();
