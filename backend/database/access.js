const sqlite3 = require("sqlite3").verbose();
const path = require("path");

class SQLiteDatabase {
  constructor() {
    // تحديد مسار SQLite بناءً على البيئة
    if (process.env.NODE_ENV === "development") {
      this.sqlitePath = path.join(__dirname, "../../database/devices.db");
    } else {
      // في التطبيق المبني، قاعدة البيانات تكون في resources
      this.sqlitePath = path.join(process.resourcesPath, "database/devices.db");
    }

    this.connection = null;
  }

  async connect() {
    try {
      if (!this.connection) {
        console.log("Connecting to SQLite database");
        this.connection = new sqlite3.Database(this.sqlitePath);
        console.log("Connected to SQLite database successfully");
      }
      return this.connection;
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
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
