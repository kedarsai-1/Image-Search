const mongoose = require('mongoose');
require('dotenv').config();

async function fixMongoDBIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('Connected to MongoDB');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // Check existing indexes on users collection
    const indexes = await db.collection('users').indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Drop the problematic emailId index if it exists
    try {
      await db.collection('users').dropIndex('emailId_1');
      console.log('Dropped emailId_1 index');
    } catch (err) {
      console.log('emailId_1 index not found or already dropped');
    }
    
    // Check if there's an email index and drop it if it exists (to avoid conflicts)
    try {
      await db.collection('users').dropIndex('email_1');
      console.log('Dropped email_1 index');
    } catch (err) {
      console.log('email_1 index not found or already dropped');
    }
    
    // Drop the problematic Password index if it exists
    try {
      await db.collection('users').dropIndex('Password_1');
      console.log('Dropped Password_1 index');
    } catch (err) {
      console.log('Password_1 index not found or already dropped');
    }
    
    // Drop the FirstName_LastName index if it exists (to avoid potential conflicts)
    try {
      await db.collection('users').dropIndex('FirstName_1_LastName_1');
      console.log('Dropped FirstName_1_LastName_1 index');
    } catch (err) {
      console.log('FirstName_1_LastName_1 index not found or already dropped');
    }
    // Create a new index on email field if you want unique emails
    // Uncomment the line below if you want unique email constraint
    // await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    
    console.log('MongoDB index fix completed successfully');
    
  } catch (error) {
    console.error('Error fixing MongoDB index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixMongoDBIndex();