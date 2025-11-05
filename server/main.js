// main.js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow;
let serverReady = false;

// ---- Start your existing Express server (server/index.js) ----
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

function startServer() {
  // Start server only if not already running
  return checkServerRunning(PORT).then((isRunning) => {
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
}

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

// Wait for app to be ready before doing ANYTHING with the app object
app.whenReady().then(async () => {
  // ---- Load environment variables FIRST ----
  // In production (packaged), load from app resources
  // In development, load from current directory
  require('dotenv').config({
    path: app.isPackaged 
      ? path.join(process.resourcesPath, 'app.asar.unpacked', '.env')
      : path.join(__dirname, '.env')
  });

  // Single-instance lock (prevents duplicate apps)
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
    return;
  }

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Auto-start on login (Windows)
  app.setLoginItemSettings({ openAtLogin: true });
  
  // Start the Express server
  await startServer();
  
  // Create the window
  createWindow();
});

app.on('window-all-closed', () => {
  // Keep app alive only on macOS UX
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
