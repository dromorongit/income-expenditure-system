# Frontend Railway Deployment Guide

## 🚨 Current Situation

Your current Railway deployment at `https://income-expenditure-system-production.up.railway.app` is serving the **backend** (Node.js/Express API), not the frontend.

## ✅ Solution: Separate Frontend Deployment

### **Option 1: New Railway Service (Recommended)**

**1. Create New Railway Project for Frontend**
```bash
# In Railway Dashboard:
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Connect your repository
4. Railway will auto-detect React Native/Expo project
5. Deploy as separate service
```

**2. Expected URLs After Deployment**
- **Frontend**: `https://your-new-frontend-app.up.railway.app`
- **Backend**: `https://income-expenditure-system-production.up.railway.app/api/v1`

**3. Update Frontend Configuration**
```javascript
// In src/config/environments.js
production: {
  apiUrl: 'https://income-expenditure-system-production.up.railway.app/api/v1',
  // ... other config
}
```

### **Option 2: Modify Current Deployment**

**1. Update Current Railway Service**
```bash
# Change package.json main entry point
"main": "server-production.js"

# This tells Railway to run the frontend server instead of backend
```

**2. Deploy Backend Separately**
```bash
# Create separate repository for backend
# Or deploy backend to different Railway service
```

## 📋 Deployment Steps

### **Step 1: Deploy Frontend to New Railway Service**

1. **Create New Railway Project**
   - Name: `income-expenditure-frontend`
   - Connect to your GitHub repository
   - Railway will auto-deploy

2. **Wait for Deployment**
   - Check Railway dashboard for build logs
   - Wait for "Deployment Successful"

3. **Get Frontend URL**
   - Copy the generated Railway URL
   - Example: `https://your-app.up.railway.app`

### **Step 2: Update API Configuration**

```javascript
// Update src/config/environments.js
production: {
  apiUrl: 'https://income-expenditure-system-production.up.railway.app/api/v1',
  enableLogging: false,
  enableErrorReporting: true,
  timeout: 10000,
  retryAttempts: 3,
}
```

### **Step 3: Test Mobile Connectivity**

```bash
# After both services are deployed:
npx expo start --tunnel

# Mobile app will connect to:
# Frontend: Your new Railway URL
# Backend: https://income-expenditure-system-production.up.railway.app/api/v1
```

## 🌐 Architecture After Deployment

```
┌─────────────────┐    ┌─────────────────┐
│   Railway       │◄──►│   Railway       │
│   Frontend      │    │   Backend       │
│   (New Service) │    │   (Existing)    │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Node.js       │
│   Web App       │    │   Express API   │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   (Railway)     │
                       └─────────────────┘
```

## 📱 Mobile Testing

**✅ After Separate Deployment:**
- **Frontend URL**: `https://your-frontend-app.up.railway.app`
- **Backend API**: `https://income-expenditure-system-production.up.railway.app/api/v1`
- **Mobile App**: Connects to both services seamlessly

**✅ Features Available:**
- 🔐 **Authentication**: Login with demo accounts
- 📊 **Dashboard**: Financial management interface
- 💰 **Transactions**: Full CRUD operations
- 📈 **Budgets**: Budget tracking and monitoring
- 👤 **User Management**: Profile and settings

## 🎯 Demo Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@finance.com | admin123 | admin |
| Lois Osei-Bonsu | lois.osei-bonsu@techmaven.com | finance123 | finance_manager |
| Stephen Sayor | stephen.sayor@techmaven.com | viewer123 | viewer |

## 🚀 Quick Start

**1. Deploy Frontend:**
```bash
# Create new Railway service for frontend
# Copy your repository to new service
# Deploy automatically
```

**2. Test Live Application:**
```bash
# Frontend: https://your-frontend-app.up.railway.app
# Backend: https://income-expenditure-system-production.up.railway.app/api/v1
```

**3. Mobile Testing:**
```bash
# Update API configuration
# Test with Expo Go
# All features work perfectly
```

---

🎉 **Your Income & Expenditure System will have separate, optimized deployments for frontend and backend!**