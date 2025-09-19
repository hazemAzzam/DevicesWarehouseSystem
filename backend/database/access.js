const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

class SQLiteDatabase {
  constructor() {
    // تحديد مسار SQLite بناءً على البيئة
    if (process.env.NODE_ENV === "development") {
      this.sqlitePath = path.join(__dirname, "../../database/devices.db");
    } else {
      // في التطبيق المبني، قاعدة البيانات تكون في resources
      // مع إضافة fallback للمسار المحلي
      const resourcesPath =
        process.resourcesPath || path.join(__dirname, "../../database");
      this.sqlitePath = path.join(resourcesPath, "database/devices.db");
    }

    this.connection = null;
    this.ensureDatabaseDirectory();
  }

  // التأكد من وجود مجلد قاعدة البيانات
  ensureDatabaseDirectory() {
    try {
      const dbDir = path.dirname(this.sqlitePath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log("Created database directory:", dbDir);
      }
    } catch (error) {
      console.error("Error creating database directory:", error);
      // Fallback to user's documents folder
      const userDocuments = path.join(
        require("os").homedir(),
        "Documents",
        "DevicesWarehouse"
      );
      this.sqlitePath = path.join(userDocuments, "devices.db");
      try {
        if (!fs.existsSync(userDocuments)) {
          fs.mkdirSync(userDocuments, { recursive: true });
        }
        console.log("Using fallback database path:", this.sqlitePath);
      } catch (fallbackError) {
        console.error("Error creating fallback directory:", fallbackError);
      }
    }
  }

  async connect() {
    try {
      if (!this.connection) {
        console.log("Connecting to SQLite database at:", this.sqlitePath);

        // إنشاء قاعدة البيانات إذا لم تكن موجودة
        this.connection = new sqlite3.Database(this.sqlitePath, (err) => {
          if (err) {
            console.error("Error opening database:", err);
            throw err;
          }
          console.log("Connected to SQLite database successfully");
        });

        // التأكد من أن قاعدة البيانات تعمل بشكل صحيح
        await this.testConnection();
      }
      return this.connection;
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }

  // اختبار الاتصال بقاعدة البيانات
  async testConnection() {
    return new Promise((resolve, reject) => {
      this.connection.get("SELECT 1", (err, row) => {
        if (err) {
          console.error("Database test query failed:", err);
          reject(err);
        } else {
          console.log("Database connection test successful");
          resolve(row);
        }
      });
    });
  }

  async query(sql, params = []) {
    try {
      const connection = await this.connect();

      return new Promise((resolve, reject) => {
        connection.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    } catch (error) {
      console.error("Query error:", error);
      throw error;
    }
  }

  async execute(sql, params = []) {
    try {
      const connection = await this.connect();

      return new Promise((resolve, reject) => {
        connection.run(sql, params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes, lastID: this.lastID });
          }
        });
      });
    } catch (error) {
      console.error("Execute error:", error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
      console.log("Database connection closed");
    }
  }
}

module.exports = new SQLiteDatabase();
