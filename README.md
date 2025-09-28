# Income & Expenditure System

This is a complete income and expenditure tracking system with a React Native frontend and Node.js/Express backend.

## System Architecture

The system consists of two main components:

1. **Frontend**: React Native mobile application (in root directory)
2. **Backend**: Node.js/Express API server (in `Income & Expenditure System Backend` directory)

## Features

- User authentication (login/register)
- Transaction management (income/expense tracking)
- Budget planning and monitoring
- Category-based organization
- Role-based access control
- Data visualization

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Expo CLI for frontend development

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd "Income & Expenditure System Backend"
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string

4. Start the backend server:
   ```
   npm run dev
   ```
   
   The backend will start on port 5000 by default.

### Frontend Setup

1. From the root directory, install dependencies:
   ```
   npm install
   ```

2. Start the Expo development server:
   ```
   npm start
   ```

3. Use the Expo Go app on your mobile device to scan the QR code, or use an emulator.

## API Integration

The frontend connects to the backend through a service layer:

- `src/services/apiService.js` - Generic HTTP client
- `src/services/authService.js` - Authentication methods
- `src/services/dataService.js` - Data management methods

All API calls are directed to `http://localhost:5000/api/v1` by default.

## Data Flow

1. User authenticates through the AuthContext
2. AuthContext uses AuthService to communicate with backend auth endpoints
3. DataContext uses DataService to fetch/manage transactions, budgets, and categories
4. All data is stored in MongoDB and served through Express.js REST API

## Testing API Connectivity

Run the test script to verify backend connectivity:
```
node test-connection.js
```

## Development Notes

- The backend uses MongoDB for data persistence
- Authentication is JWT-based
- All API endpoints are protected with appropriate middleware
- Frontend uses React Context for state management
- Responsive design works on both mobile and tablet devices

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend server is running and accessible
2. **Authentication Failures**: Check JWT_SECRET configuration
3. **Connection Refused**: Verify MongoDB connection string in .env file

### Need Help?

For additional support, check the backend documentation in `Income & Expenditure System Backend/README.md`