const db = require("./backend/database/access");

async function testDatabase() {
  console.log("Testing database connection...");

  try {
    // Test connection
    await db.connect();
    console.log("✅ Database connection successful");

    // Test query
    const result = await db.query("SELECT 1 as test");
    console.log("✅ Database query test successful:", result);

    // Test table creation
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `;

    await db.execute(createTableSQL);
    console.log("✅ Table creation test successful");

    // Test insert
    await db.execute("INSERT INTO test_table (name) VALUES (?)", ["test_data"]);
    console.log("✅ Insert test successful");

    // Test select
    const rows = await db.query("SELECT * FROM test_table");
    console.log("✅ Select test successful:", rows);

    // Clean up
    await db.execute("DROP TABLE test_table");
    console.log("✅ Cleanup successful");

    console.log("\n🎉 All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
    console.error("Error details:", error.message);
  } finally {
    await db.close();
    console.log("Database connection closed");
  }
}

// Run the test
testDatabase();
