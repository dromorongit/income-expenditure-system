# Income & Expenditure System Backend - Setup Instructions

## Prerequisites

1. Node.js (v14 or higher)
2. npm (comes with Node.js) or yarn
3. MongoDB (local installation or MongoDB Atlas account)

## Installation Steps

### 1. Navigate to the Backend Directory
```bash
cd "Income & EXpenditure System Backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend root directory (or modify the existing one) with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/income_expenditure_system
JWT_SECRET=income_expenditure_system_secret_key
JWT_EXPIRE=30d
```

If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/income_expenditure_system?retryWrites=true&w=majority
```

### 4. Database Setup

#### Option A: Local MongoDB Installation
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start the MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. The application will automatically create the database and collections on first run

#### Option B: MongoDB Atlas
1. Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Add your IP address to the IP whitelist (or allow access from anywhere for development)
5. Get your connection string and update the `MONGODB_URI` in your `.env` file

### 5. Start the Development Server

```bash
npm run dev
```

The backend server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user details
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update user password

### Users (Admin Only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/users/stats` - Get user statistics

### Transactions
- `GET /api/v1/transactions` - Get all transactions
- `GET /api/v1/transactions/:id` - Get single transaction
- `POST /api/v1/transactions` - Create new transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `GET /api/v1/transactions/stats` - Get transaction statistics
- `PUT /api/v1/transactions/:id/approve` - Approve transaction (Admin)
- `PUT /api/v1/transactions/:id/reject` - Reject transaction (Admin)

### Budgets
- `GET /api/v1/budgets` - Get all budgets
- `GET /api/v1/budgets/:id` - Get single budget
- `POST /api/v1/budgets` - Create new budget (Admin)
- `PUT /api/v1/budgets/:id` - Update budget (Admin)
- `DELETE /api/v1/budgets/:id` - Delete budget (Admin)
- `GET /api/v1/budgets/report` - Get budget report
- `GET /api/v1/budgets/stats` - Get budget statistics

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get single category
- `POST /api/v1/categories` - Create new category (Admin)
- `PUT /api/v1/categories/:id` - Update category (Admin)
- `DELETE /api/v1/categories/:id` - Delete category (Admin)
- `GET /api/v1/categories/with-transactions` - Get categories with transaction counts
- `GET /api/v1/categories/stats` - Get category statistics

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- curl commands
- VS Code REST Client extension

Example curl command to test the API:
```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "message": "Income & Expenditure System API"
}
```

## User Roles and Permissions

The system has three user roles:
1. **super_admin** - Full access to all features
2. **finance_admin** - Can manage transactions, budgets, and categories
3. **viewer** - Read-only access to reports and transactions

## Data Models

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: super_admin, finance_admin, viewer)
- department (String)
- permissions (Array)
- avatar (String)
- isActive (Boolean)

### Transaction
- type (String: income, expense)
- amount (Number)
- category (String)
- categoryId (String)
- description (String)
- date (Date)
- createdBy (String)
- approvedBy (String)
- status (String: pending, approved, rejected)
- receiptUrl (String)
- recurring (Object)
- tags (Array)
- notes (String)

### Budget
- categoryId (String)
- categoryName (String)
- monthlyLimit (Number)
- currentSpent (Number)
- year (Number)
- month (Number)
- alerts (Object)

### Category
- name (String, unique)
- type (String: income, expense)
- icon (String)
- color (String)
- description (String)
- isActive (Boolean)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in the `.env` file
   - Verify network connectivity if using MongoDB Atlas

2. **Port Already in Use**
   - Change the `PORT` value in your `.env` file
   - Or stop the process using the current port

3. **JWT Secret Not Found**
   - Ensure `JWT_SECRET` is set in your `.env` file

### Need Help?

If you encounter any issues during setup:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check MongoDB connection and permissions

For additional support, please refer to the main project README or create an issue in the repository.