const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/income_expenditure_system', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0, // Disable mongoose buffering
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return; // Successfully connected, exit the function
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);

      if (attempt >= retries) {
        console.error('❌ Failed to connect to MongoDB after maximum retries');
        console.error('🔧 Please check:');
        console.error('1. MONGODB_URI environment variable is set correctly');
        console.error('2. MongoDB service is running and accessible');
        console.error('3. Network connectivity to database');
        console.error('4. Database credentials are correct');
        console.error('📝 The application will continue running but database operations will fail');
        return; // Don't exit the process, just log the error
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
      console.log(`⏳ Retrying MongoDB connection in ${delay}ms... (${attempt}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;