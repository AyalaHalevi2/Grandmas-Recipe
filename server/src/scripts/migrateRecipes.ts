import mongoose from 'mongoose';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { connectDB } from '../config/db';

/**
 * Migration script to update existing recipes with new Group system fields
 *
 * This script:
 * 1. Connects to the database
 * 2. Finds all recipes without the new fields (creator, visibility, groupIds)
 * 3. Updates them with default values:
 *    - creator: null (or system admin if preferred)
 *    - visibility: 'public'
 *    - groupIds: []
 */
async function migrateRecipes(): Promise<void> {
  try {
    console.log('Starting recipe migration...');

    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Optional: Find system admin to assign as creator
    // Uncomment the next two lines if you want to assign existing recipes to the sys admin
    // const sysAdmin = await User.findOne({ role: 'admin' });
    // console.log(`System admin found: ${sysAdmin?.email}`);

    // Update all recipes that don't have the new fields
    const result = await Recipe.updateMany(
      {
        $or: [
          { creator: { $exists: false } },
          { visibility: { $exists: false } },
          { groupIds: { $exists: false } }
        ]
      },
      {
        $set: {
          creator: null,              // Or sysAdmin?._id if you want to assign to admin
          visibility: 'public',
          groupIds: []
        }
      }
    );

    console.log(`✅ Migration completed successfully`);
    console.log(`   Recipes updated: ${result.modifiedCount}`);
    console.log(`   Recipes matched: ${result.matchedCount}`);

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

    process.exit(0);
  } catch (error: unknown) {
    console.error('❌ Migration failed:');
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
    } else {
      console.error(`   Unknown error:`, error);
    }

    // Close database connection
    await mongoose.connection.close();

    process.exit(1);
  }
}

// Run migration
migrateRecipes();
