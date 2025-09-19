const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

// Express server for API
const apiServer = express();
apiServer.use(cors());
apiServer.use(express.json());

// Import API routes
const deviceRoutes = require("./backend/routes/devices");

// Use device routes
apiServer.use("/api/devices", deviceRoutes);

let mainWindow;
let server;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    // icon: path.join(__dirname, "assets/icon.png"), // Removed - no icon file
    title: "نظام مخزن الأجهزة",
  });

  // Start API server
  server = apiServer.listen(3001, () => {
    console.log("API Server running on port 3001");
  });

  // Load the React app
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // Development mode - load from localhost
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode - load from build files
    // في التطبيق المبني، الملفات تكون في app.asar
    const buildPath = path.join(__dirname, "frontend/build/index.html");
    console.log("Loading from:", buildPath);
    console.log("File exists:", fs.existsSync(buildPath));

    if (fs.existsSync(buildPath)) {
      mainWindow.loadFile(buildPath);
    } else {
      // في التطبيق المبني، الملفات تكون في app.asar
      // نحتاج لاستخدام loadURL مع file:// protocol
      const appPath = path.join(__dirname, "frontend/build/index.html");
      console.log("Trying app path:", appPath);

      // تحويل المسار إلى URL مع إصلاح المسار
      const normalizedPath = appPath.replace(/\\/g, "/");
      const fileUrl = `file:///${normalizedPath}`;
      console.log("Loading URL:", fileUrl);

      mainWindow.loadURL(fileUrl).catch((err) => {
        console.error("Error loading file:", err);
        // محاولة أخرى مع مسار مختلف
        const altUrl = `file://${appPath.replace(/\\/g, "/")}`;
        console.log("Trying alternative URL:", altUrl);

        mainWindow.loadURL(altUrl).catch((err2) => {
          console.error("Error loading alternative file:", err2);
          mainWindow.loadURL(
            "data:text/html,<h1>Error: React build files not found!</h1><p>Path: " +
              appPath +
              "</p><p>Error: " +
              err2.message +
              "</p>"
          );
        });
      });
    }
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (server) {
      server.close();
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for database operations
ipcMain.handle("get-devices", async () => {
  try {
    const deviceService = require("./backend/services/deviceService");
    return await deviceService.getAllDevices();
  } catch (error) {
    console.error("Error getting devices:", error);
    // إرجاع مصفوفة فارغة بدلاً من رمي الخطأ
    if (
      error.message.includes("SQLITE_CANTOPEN") ||
      error.message.includes("unable to open database file")
    ) {
      console.log("Database file not accessible, returning empty array");
      return [];
    }
    throw error;
  }
});

ipcMain.handle("add-device", async (event, deviceData) => {
  try {
    const deviceService = require("./backend/services/deviceService");
    return await deviceService.addDevice(deviceData);
  } catch (error) {
    console.error("Error adding device:", error);
    if (
      error.message.includes("SQLITE_CANTOPEN") ||
      error.message.includes("unable to open database file")
    ) {
      console.log("Database file not accessible, cannot add device");
      return { success: false, error: "Database not accessible" };
    }
    throw error;
  }
});

ipcMain.handle("update-device", async (event, id, deviceData) => {
  try {
    const deviceService = require("./backend/services/deviceService");
    return await deviceService.updateDevice(id, deviceData);
  } catch (error) {
    console.error("Error updating device:", error);
    if (
      error.message.includes("SQLITE_CANTOPEN") ||
      error.message.includes("unable to open database file")
    ) {
      console.log("Database file not accessible, cannot update device");
      return { success: false, error: "Database not accessible" };
    }
    throw error;
  }
});

ipcMain.handle("delete-device", async (event, id) => {
  try {
    const deviceService = require("./backend/services/deviceService");
    return await deviceService.deleteDevice(id);
  } catch (error) {
    console.error("Error deleting device:", error);
    if (
      error.message.includes("SQLITE_CANTOPEN") ||
      error.message.includes("unable to open database file")
    ) {
      console.log("Database file not accessible, cannot delete device");
      return { success: false, error: "Database not accessible" };
    }
    throw error;
  }
});
