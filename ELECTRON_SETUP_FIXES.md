# Electron App Setup Fixes

## Issues Fixed

### 1. Missing preload.js File
**Problem:** The `main.js` file referenced a `preload.js` file that didn't exist, causing Electron to fail on startup.

**Solution:** Created `server/preload.js` with proper context bridge setup for secure IPC communication between main and renderer processes.

### 2. Incorrect Build Configuration
**Problem:** The `package.json` build configuration had several issues:
- Referenced files without proper paths (e.g., `emailTemplate.js`, `orderData.js` were in subdirectories)
- Missing critical directories like `controllers`, `middleware`, `models`, `services`
- Incorrect path to client build folder

**Solution:** Updated the build configuration to:
- Include all necessary server directories with proper glob patterns
- Add `extraResources` to properly copy the client build folder
- Add exclusions for unnecessary files to reduce bundle size
- Properly handle the `../client/build` path

### 3. Client Build Path Handling
**Problem:** The `main.js` assumed the client build was at `client/build/index.html` which wouldn't work in both development and production environments.

**Solution:** Updated `main.js` to:
- Detect whether the app is packaged or running in development
- Use appropriate paths for each environment:
  - Development: `../client/build/index.html`
  - Production: `resources/client/build/index.html`
- Add file existence verification with helpful error messages
- Add optional DevTools for development debugging

## How to Test

### Step 1: Build the React Client
```bash
cd client
npm run build
cd ..
```

### Step 2: Test in Development Mode
```bash
cd server
npm run electron:start
```

This should launch the Electron app with your React frontend.

### Step 3: Build the Electron App
```bash
cd server
npm run electron:build
```

This will create a distributable installer in `server/dist/`.

### Step 4: Test the Built App
Navigate to `server/dist/` and run the installer to test the packaged version.

## Key Changes Made

### Files Created:
- `server/preload.js` - Secure IPC bridge for Electron

### Files Modified:
- `server/package.json` - Fixed build configuration
- `server/main.js` - Fixed client build path handling

## Additional Notes

### Environment Variables
Make sure you have a `.env` file in the server directory with necessary configuration:
```env
PORT=5000
HOST=0.0.0.0
# Add other environment variables as needed
```

### Database Setup
Ensure your database is properly configured in `server/config/config.json` before running the app.

### Auto-start on Login
The app is configured to auto-start on Windows login. You can disable this by commenting out or removing this line in `main.js`:
```javascript
app.setLoginItemSettings({ openAtLogin: true });
```

## Troubleshooting

### If the app doesn't start:
1. Check that React build exists: `client/build/index.html`
2. Run `npm run react:build` from the server directory
3. Check console for error messages

### If the app shows a blank screen:
1. Uncomment the DevTools line in `main.js` to debug
2. Check if the Express server is running (check terminal output)
3. Verify the React build is valid

### If building fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Make sure all dependencies are installed
4. Check that you have write permissions to the `dist` directory

## Scripts Available

- `npm run server` - Run Express server only (development)
- `npm run dev` - Run Express server with nodemon (development)
- `npm run react:build` - Build React client
- `npm run electron:start` - Start Electron app in development
- `npm run electron:pack` - Package app without installer (for testing)
- `npm run electron:build` - Build full installer
- `npm run package-app` - Complete build pipeline (build React + build Electron)
