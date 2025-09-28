# Setup Instructions

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local or cloud instance)
3. Expo CLI for frontend development

## Installing MongoDB

### Option 1: Install MongoDB Community Server (Local)

1. Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server for your operating system
3. Install MongoDB following the installation wizard
4. Start the MongoDB service:
   - **Windows**: MongoDB service should start automatically after installation
   - **macOS**: Run `brew services start mongodb-community` (if installed via Homebrew)
   - **Linux**: Run `sudo systemctl start mongod`

### Option 2: Use MongoDB Atlas (Cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string from the Atlas dashboard
4. Update `MONGODB_URI` in the `.env` file with your connection string

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd "Income & Expenditure System Backend"
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - The `.env` file is already configured with default values
   - Update `MONGODB_URI` in the `.env` file if you're using MongoDB Atlas or a different MongoDB instance

4. Start MongoDB (if using local installation):
   - Make sure MongoDB is running on your system
   - You can start it by running `mongod` in a separate terminal

5. Start the backend server:
   ```
   node server.js
   ```
   
   The backend will start on port 5000 by default.

## Frontend Setup

1. From the root directory, install dependencies:
   ```
   npm install
   ```

2. Start the Expo development server:
   ```
   npm start
   ```

3. Use the Expo Go app on your mobile device to scan the QR code, or use an emulator.

## Testing API Connectivity

Run the test script to verify backend connectivity:
```
node test-connection.js
```

## Common Issues

1. **MongoDB Connection Failed**:
   - Make sure MongoDB is installed and running
   - Check the connection string in `.env` file
   - For local MongoDB, try running `mongod` to start MongoDB service

2. **Port Already in Use**:
   - Change the PORT in `.env` file to a different port

3. **CORS Errors**:
   - Ensure the backend server is running
   - Check that the frontend is configured to connect to the correct backend URL

## Need Help?

For additional support, check the README.md file for more detailed information.