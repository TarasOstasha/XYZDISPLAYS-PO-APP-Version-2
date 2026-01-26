# Complete Deployment Workflow for Version Notifications

## 🎯 Goal
When you upload a new build to your FTP server, all users currently using the app should **automatically** see a notification about the new version.

## ✅ Current Setup (Already Working!)

Your system is fully automated:

### 1️⃣ **Build Phase** (Your Computer)
```bash
cd client
npm run build
```

What happens automatically:
- ✅ Version increments (1.0.2 → 1.0.3) in `server/version.json`
- ✅ Build is created in `client/build/` folder
- ✅ Ready for deployment

### 2️⃣ **Upload Phase** (FTP to Server)
Upload these files/folders via FTP to your server:
- 📁 `client/build/` → Upload to `/prod/` on FTP server
- 📁 `server/` folder → Upload to `/server/` on FTP server (includes `version.json`)

**IMPORTANT**: 
- The `server/version.json` file **must be uploaded** to `/server/version.json`
- Users' "Update APP" button will download both folders from FTP
- The `/prod/` folder contains the client build
- The `/server/` folder contains server files including `version.json`

### 3️⃣ **User Notification Phase** (Automatic!)
For users already using your app:

**Without any manual action:**
- ⏱️ Every 30 seconds, their app checks: `GET /api/version`
- 🔍 Compares server version (1.0.3) with their local version (1.0.2)
- 🔔 If different → **Notification appears automatically!**
- 🎉 User clicks "Refresh Now" → Gets the update

## 📋 Complete Step-by-Step Example

### Scenario: You made changes and want to deploy

**Step 1: Build the App**
```bash
cd client
npm run build
```

Console shows:
```
✅ Version updated successfully!
   1.0.2 → 1.0.3
   Updated at: 2026-01-26T20:39:54.356Z

Creating an optimized production build...
```

**Step 2: Upload via FTP**
Upload to your FTP server:
- ✅ `client/build/*` → Upload to `/prod/` folder on FTP
- ✅ `server/*` → Upload to `/server/` folder on FTP (includes `version.json`)

**Important**: The system downloads from:
- `/prod/` → Goes to local `client/build/`
- `/server/` → Goes to local `server/` (this includes `version.json`)

**Step 3: Users Get Notified (Automatic!)**
- 🎯 User "John" is using your app (has version 1.0.2 in browser)
- 🕒 30 seconds after you upload (or on next page refresh)
- 📡 John's app checks `/api/version` endpoint
- 📨 Server returns: `{"version": "1.0.3", ...}`
- 🔔 John's browser shows: **"New Version Available! Version 1.0.3 is now available"**
- 👆 John clicks "Refresh Now" → Updated!

## 🔧 How It Works Technically

### Client-Side (Browser)
```javascript
// Runs every 30 seconds automatically
useEffect(() => {
    const checkVersion = async () => {
        const response = await fetch(`${API_BASE_URL}/api/version`);
        const data = await response.json();
        const serverVersion = data.version; // "1.0.3"
        const localVersion = localStorage.getItem('appVersion'); // "1.0.2"
        
        if (localVersion !== serverVersion) {
            // Show notification!
            setShowNotification(true);
        }
    };
    
    checkVersion();
    const interval = setInterval(checkVersion, 30000);
}, []);
```

### Server-Side (API)
```javascript
// GET /api/version
// Returns content of server/version.json
{
  "version": "1.0.3",
  "lastUpdated": "2026-01-26T20:39:54.356Z"
}
```

### Update APP Button (User's PC)
When user clicks "Refresh Now" or "Update APP":
```javascript
// Downloads from FTP:
// 1. /prod/ → client/build/ (React app files)
// 2. /server/ → server/ (includes version.json)
// 
// After download completes, page reloads with new version
```

## ✨ What's Automatic (No Manual Steps Needed)

✅ **Version increment on build**
✅ **User notification checks** (every 30 seconds)
✅ **Notification display** (when versions differ)
✅ **Timestamp tracking**
✅ **Update process** (via "Refresh Now" button)

## ❗ What You Must Do

1. ✅ Run `npm run build` before deploying (version auto-increments)
2. ✅ Upload `client/build/*` to `/prod/` folder on FTP
3. ✅ Upload `server/*` (including `version.json`) to `/server/` folder on FTP
4. ✅ Ensure your API server is running

**Critical**: Both `/prod/` and `/server/` folders must be uploaded to FTP for the update system to work!

## 🎬 Real-World Example

### Day 1 - 9:00 AM
- You: Build and deploy version 1.0.5
- Users: Currently on 1.0.4, using the app

### Day 1 - 9:00:30 AM (30 seconds later)
- Users' browsers automatically check server
- See version 1.0.5 is available
- Notification pops up: "New Version Available!"
- Users can click "Refresh Now" to update

**You did nothing after uploading!** It's fully automatic! 🎉

## 🔍 Verify It's Working

### Check 1: Version File is Accessible
Open in browser: `http://your-server.com/api/version`

Should return:
```json
{
  "version": "1.0.3",
  "lastUpdated": "2026-01-26T20:39:54.356Z"
}
```

### Check 2: Client is Checking
Open browser console (F12) in your app, you should see:
```
Initial version set: 1.0.3
```

### Check 3: Trigger Notification
1. Open app in browser
2. In another terminal, run: `node server/increment-version.js`
3. Wait 30 seconds (or refresh page)
4. Notification should appear!

## 🎯 Summary

**You only need to:**
1. `npm run build` (version auto-increments)
2. Upload via FTP (build files + version.json)
3. Done! Users get notified automatically!

**The system handles:**
- ✅ Version tracking
- ✅ Periodic checks
- ✅ Notification display
- ✅ Update process

No manual steps needed after deployment! 🚀
