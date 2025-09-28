# Frontend Deployment Guide

## 🚀 Railway Deployment

Your React Native/Expo frontend is now configured for Railway deployment!

### **✅ What's Fixed**
- ✅ Added missing `expo-build-properties` plugin
- ✅ Created production build configuration
- ✅ Added Express server for production serving
- ✅ Configured proper build scripts

### **📋 Deployment Commands**

**For Development:**
```bash
npm run dev        # Start Expo development server
npm run web        # Start web development server
npm run android    # Start Android development
npm run ios        # Start iOS development
```

**For Production:**
```bash
npm run build:railway     # Build for Railway deployment
npm start                 # Start production server
```

### **🏗️ Railway Deployment Steps**

1. **Push to GitHub**: Your changes are ready to deploy
2. **Automatic Deployment**: Railway will detect the changes and rebuild
3. **Build Process**: Railway runs your `build.sh` script
4. **Production Server**: Express server serves the built web app

### **🌐 URLs After Deployment**

- **Frontend**: `https://your-railway-app.up.railway.app`
- **Backend**: `https://income-expenditure-system-production.up.railway.app`
- **Full System**: Both frontend and backend accessible

### **🔧 Environment Configuration**

**Development** (`.env`):
```bash
API_URL=http://localhost:5000/api/v1
```

**Production** (`.env.production`):
```bash
API_URL=https://income-expenditure-system-production.up.railway.app/api/v1
```

### **📱 Features Available**

- ✅ **Responsive Web App**: Works on desktop and mobile
- ✅ **Authentication**: Login/register with demo accounts
- ✅ **Dashboard**: Financial overview and management
- ✅ **Transaction Management**: Add, edit, approve transactions
- ✅ **Budget Tracking**: Budget creation and monitoring
- ✅ **User Management**: Profile and settings management
- ✅ **Reports**: Financial reporting and analytics

### **🎯 Demo Accounts**

After deployment, use these accounts to test:

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@finance.com | admin123 | admin |
| Lois Osei-Bonsu | lois.osei-bonsu@techmaven.com | finance123 | finance_manager |
| Stephen Sayor | stephen.sayor@techmaven.com | viewer123 | viewer |

### **🚀 Next Steps**

1. **Deploy**: Push changes to GitHub - Railway will auto-deploy
2. **Test**: Access your deployed frontend
3. **Database**: Ensure MongoDB Atlas IP whitelist includes Railway's IP
4. **Backend**: Verify backend is running and accessible

### **🔍 Troubleshooting**

**If deployment fails:**
- Check Railway build logs
- Ensure all dependencies are installed
- Verify environment variables are loaded

**If app doesn't load:**
- Check browser console for errors
- Verify API endpoints are accessible
- Confirm CORS configuration

---

🎉 **Your Income & Expenditure System is now ready for production deployment!**