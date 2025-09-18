const db = require("../database/access");

class DeviceService {
  constructor() {
    this.tableName = "Devices";
  }

  // إنشاء جدول الأجهزة إذا لم يكن موجوداً
  async initializeTable() {
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          DeviceName TEXT NOT NULL,
          DeviceType TEXT NOT NULL,
          SerialNumber TEXT UNIQUE NOT NULL,
          CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await db.execute(createTableSQL);
      console.log("Devices table created successfully");
    } catch (error) {
      // الجدول موجود بالفعل
      if (!error.message.includes("already exists")) {
        console.error("Error creating table:", error);
        throw error;
      }
    }
  }

  // الحصول على جميع الأجهزة
  async getAllDevices() {
    try {
      await this.initializeTable();
      const sql = `SELECT * FROM ${this.tableName} ORDER BY CreatedAt DESC`;
      const result = await db.query(sql);
      return result;
    } catch (error) {
      console.error("Error getting devices:", error);
      throw error;
    }
  }

  // إضافة جهاز جديد
  async addDevice(deviceData) {
    try {
      await this.initializeTable();
      const { deviceName, deviceType, serialNumber } = deviceData;

      const sql = `
        INSERT INTO ${this.tableName} (DeviceName, DeviceType, SerialNumber)
        VALUES (?, ?, ?)
      `;

      const result = await db.execute(sql, [
        deviceName,
        deviceType,
        serialNumber,
      ]);
      return { success: true, id: result.lastID };
    } catch (error) {
      console.error("Error adding device:", error);
      throw error;
    }
  }

  // تحديث جهاز
  async updateDevice(id, deviceData) {
    try {
      const { deviceName, deviceType, serialNumber } = deviceData;

      const sql = `
        UPDATE ${this.tableName} 
        SET DeviceName = ?, DeviceType = ?, SerialNumber = ?, UpdatedAt = CURRENT_TIMESTAMP
        WHERE ID = ?
      `;

      const result = await db.execute(sql, [
        deviceName,
        deviceType,
        serialNumber,
        id,
      ]);
      return { success: true, affectedRows: result.changes };
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  }

  // حذف جهاز
  async deleteDevice(id) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE ID = ?`;
      const result = await db.execute(sql, [id]);
      return { success: true, affectedRows: result.changes };
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  }

  // البحث عن جهاز بالرقم التسلسلي
  async getDeviceBySerial(serialNumber) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE SerialNumber = ?`;
      const result = await db.query(sql, [serialNumber]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting device by serial:", error);
      throw error;
    }
  }
}

module.exports = new DeviceService();
