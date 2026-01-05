import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Migration script to convert isYemeni boolean to ethnicity string
 *
 * This script:
 * 1. Finds all recipes with isYemeni: true and sets ethnicity: "תימני"
 * 2. Removes the isYemeni field from all recipes
 */
const migrateEthnicity = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grandma-recipes';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const recipesCollection = db.collection('recipes');

    // Step 1: Convert isYemeni: true to ethnicity: "תימני"
    const updateResult = await recipesCollection.updateMany(
      { isYemeni: true },
      { $set: { ethnicity: 'תימני' } }
    );
    console.log(`✅ Set ethnicity to "תימני" for ${updateResult.modifiedCount} Yemeni recipes`);

    // Step 2: Set empty ethnicity for non-Yemeni recipes that don't have ethnicity yet
    const setEmptyResult = await recipesCollection.updateMany(
      { ethnicity: { $exists: false } },
      { $set: { ethnicity: '' } }
    );
    console.log(`✅ Set empty ethnicity for ${setEmptyResult.modifiedCount} recipes`);

    // Step 3: Remove the isYemeni field from all recipes
    const removeResult = await recipesCollection.updateMany(
      { isYemeni: { $exists: true } },
      { $unset: { isYemeni: '' } }
    );
    console.log(`✅ Removed isYemeni field from ${removeResult.modifiedCount} recipes`);

    await mongoose.disconnect();
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrateEthnicity();
