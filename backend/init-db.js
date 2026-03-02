const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
  const connectionUrl = process.env.DATABASE_URL;
  console.log("Connecting to database...");

  const connection = await mysql.createConnection({
    uri: connectionUrl,
    ssl: { rejectUnauthorized: true }
  });

  console.log("Creating Contact table if it doesn't exist...");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS Contact (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phoneNumber VARCHAR(255),
      email VARCHAR(255),
      linkedId INT,
      linkPrecedence ENUM('primary', 'secondary') DEFAULT 'primary',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deletedAt DATETIME NULL
    );
  `);
  console.log("Production Database & Schema Successfully Initialized.");
  process.exit(0);
}

init().catch(err => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
