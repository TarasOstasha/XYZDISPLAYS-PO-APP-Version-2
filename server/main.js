// main.js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

// ---- Start your existing Express server (server/index.js) ----
// Check if server is already running before starting
const PORT = process.env.PORT || '5000';

function checkServerRunning(port) {
  return new Promise((resolve) => {
    const testServer = http.createServer();
    testServer.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Server is running
      } else {
        resolve(false);
      }
    });
    testServer.once('listening', () => {
      testServer.close();
      resolve(false); // Port is free
    });
    testServer.listen(port);
  });
}

// Variable to track if server is ready
let serverReady = false;

// Start server only if not already running
checkServerRunning(PORT).then((isRunning) => {
  if (isRunning) {
    console.log(`Server already running on port ${PORT}`);
    serverReady = true;
  } else {
    process.env.PORT = PORT;
    require('./index.js'); // this runs your existing HTTP server
    // Give the server a moment to start
    setTimeout(() => {
      serverReady = true;
    }, 2000);
  }
});

// Single-instance lock (prevents duplicate apps)
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // Allow loading local files
    },
  });

  // Wait for server to be ready before loading
  const loadApp = () => {
    if (serverReady) {
      // Load the app from the Express server
      // This allows the server to properly serve static files and handle API routes
      mainWindow.loadURL(`http://localhost:${PORT}`);
    } else {
      setTimeout(loadApp, 100);
    }
  };
  
  loadApp();

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Open external links in the system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Optional: Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  // Auto-start on login (Windows)
  app.setLoginItemSettings({ openAtLogin: true });
  createWindow();
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  // Keep app alive only on macOS UX
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
