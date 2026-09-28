# Auto Version Increment on Build

## Overview
The version.json file now **automatically increments** every time you run `npm run build` in the client folder!

## How It Works

### 1. **Pre-Build Hook**
When you run `npm run build`, the `prebuild` script automatically runs first:
```json
"prebuild": "node ../server/increment-version.js"
```

### 2. **Automatic Version Bump**
The script (`server/increment-version.js`) does the following:
- Reads `server/version.json`
- Parses the current version (e.g., "1.0.2")
- Increments the patch version (last number): 1.0.2 → 1.0.3
- Updates the timestamp
- Saves back to `version.json`

### 3. **Version Notification Triggers**
After the build is deployed:
- Users with the old version will see the notification
- Clicking "Refresh Now" will update and reload the app

## Usage

### Build Your App (Auto-Increments Version)
```bash
cd client
npm run build
```

Output will show:
```
✅ Version updated successfully!
   1.0.2 → 1.0.3
   Updated at: 2026-01-26T20:39:54.356Z
```

### Manual Version Increment (Optional)
If you want to increment the version without building:
```bash
node server/increment-version.js
```

## Version Format

The system uses semantic versioning with the patch number auto-incrementing:

- **Format**: `MAJOR.MINOR.PATCH`
- **Example**: `1.0.0` → `1.0.1` → `1.0.2` → `1.0.3`
- **Auto-increments**: Only the PATCH (last number)

### Manual Major/Minor Updates

To manually update major or minor versions, edit `server/version.json`:

```json
{
  "version": "2.0.0",
  "lastUpdated": "2026-01-26T20:00:00.000Z"
}
```

The next build will continue from there: 2.0.0 → 2.0.1 → 2.0.2...

## Complete Workflow

### Development & Deployment Flow:

1. **Make code changes** to your app
2. **Run build** in client folder:
   ```bash
   cd client
   npm run build
   ```
3. **Version auto-increments** (e.g., 1.0.2 → 1.0.3)
4. **Deploy** the build to your server
5. **Users get notified** automatically when they access the app
6. **Users click "Refresh Now"** to update

## Files Modified

### New Files:
- `server/increment-version.js` - Script that increments version

### Updated Files:
- `client/package.json` - Added `prebuild` script
- `server/version.json` - Gets auto-updated on each build

## Benefits

✅ **No manual version management** - Forget about updating version numbers!
✅ **Automatic notifications** - Users know when updates are available
✅ **Seamless updates** - One-click refresh with full update process
✅ **Build tracking** - Every build gets a unique version number
✅ **Timestamp tracking** - Know exactly when each version was created

## Example Build Output

```bash
$ npm run build

> client@0.1.0 prebuild
> node ../server/increment-version.js

✅ Version updated successfully!
   1.0.2 → 1.0.3
   Updated at: 2026-01-26T20:39:54.356Z

> client@0.1.0 build
> react-scripts build

Creating an optimized production build...
...
```

## Troubleshooting

### Script Fails on Build
If the version increment fails, the build will stop. Check:
- `server/version.json` exists and is valid JSON
- File has correct format: `{"version": "1.0.0", "lastUpdated": ""}`

### Version Not Incrementing
Make sure you're running `npm run build`, not just `react-scripts build` directly.

### Reset Version
To reset to a specific version, manually edit `server/version.json`:
```json
{
  "version": "1.0.0",
  "lastUpdated": ""
}
```
