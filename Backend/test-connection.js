const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Try to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/income_expenditure_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Connection test failed. Please check your MongoDB setup.');
    process.exit(1);
  }
};

connectDB();