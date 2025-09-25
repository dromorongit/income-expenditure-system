const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/income_expenditure_system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Please make sure MongoDB is installed and running.');
    console.log('To install MongoDB:');
    console.log('1. Visit https://www.mongodb.com/try/download/community');
    console.log('2. Download and install MongoDB Community Server');
    console.log('3. Start MongoDB service or run "mongod" in a separate terminal');
    console.log('');
    console.log('Alternatively, you can use MongoDB Atlas (cloud version):');
    console.log('1. Sign up at https://www.mongodb.com/cloud/atlas');
    console.log('2. Create a free cluster');
    console.log('3. Update MONGODB_URI in .env with your connection string');
    process.exit(1);
  }
};

module.exports = connectDB;