# Version Notification System

## Overview
This system notifies users when a new version of the application is available after pulling data from the FPV server.

## How It Works

### Backend
1. **Version Tracking** (`server/version.json`): Stores the current version and last update timestamp
2. **Version Controller** (`server/controllers/versionController.js`): 
   - `getVersion()`: API endpoint to get the current version
   - `updateVersion()`: Automatically increments version after successful FTP download
3. **Update Process**: When the "Update APP" button is clicked, the system:
   - Downloads files from the FTP server
   - Automatically increments the version number (e.g., 1.0.0 → 1.0.1)
   - Updates the timestamp

### Frontend
1. **VersionNotification Component**: 
   - Checks for version updates every 30 seconds
   - Compares current server version with locally stored version
   - Displays a notification when a new version is detected
   - Provides two actions:
     - **Refresh Now**: Reloads the page to get the new version
     - **Later**: Dismisses the notification but marks the version as seen

## User Flow

1. Admin pulls new data from FPV server via "Update APP" button
2. Backend downloads the files and automatically increments version
3. All users see a notification banner: "New Version Available!"
4. Users can either:
   - Click "Refresh Now" to immediately reload and get updates
   - Click "Later" to dismiss and continue working

## API Endpoints

- **GET** `/api/version`: Returns current version information
  ```json
  {
    "version": "1.0.1",
    "lastUpdated": "2025-12-23T20:21:00.000Z"
  }
  ```

## Configuration

### Change Check Interval
Edit `client/src/components/VersionNotification/index.jsx`:
```javascript
const interval = setInterval(checkVersion, 30000); // 30 seconds (30000ms)
```

### Manual Version Update
Edit `server/version.json`:
```json
{
  "version": "2.0.0",
  "lastUpdated": "2025-12-23T20:21:00.000Z"
}
```

## Styling
The notification uses a gradient purple theme and appears in the top-right corner. Customize appearance in:
`client/src/components/VersionNotification/VersionNotification.module.scss`

## Technical Details

- Version format: Semantic versioning (MAJOR.MINOR.PATCH)
- Auto-increment: Only PATCH version is incremented
- Storage: localStorage key `appVersion`
- Persistence: Notification shows until user interacts with it
- Responsive: Adapts to mobile screens
