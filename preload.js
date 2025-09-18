const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Device operations
  getDevices: () => ipcRenderer.invoke("get-devices"),
  addDevice: (deviceData) => ipcRenderer.invoke("add-device", deviceData),
  updateDevice: (id, deviceData) =>
    ipcRenderer.invoke("update-device", id, deviceData),
  deleteDevice: (id) => ipcRenderer.invoke("delete-device", id),

  // HTTP API calls
  apiCall: async (url, options = {}) => {
    const response = await fetch(`http://localhost:3001${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    return response.json();
  },
});
