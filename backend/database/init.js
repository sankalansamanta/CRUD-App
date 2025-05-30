import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'evcharging.db');

export const getDb = () => {
  return new Database(dbPath);
};

export const initializeDatabase = () => {
  const db = getDb();
  
  // Create Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create Charging Stations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS charging_stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      status TEXT CHECK(status IN ('Active', 'Inactive')) NOT NULL,
      power_output REAL NOT NULL,
      connector_type TEXT NOT NULL,
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);
  
  // Add some sample data if tables are empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const stationCount = db.prepare('SELECT COUNT(*) as count FROM charging_stations').get();
  
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('password123', 10);
    
    db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `).run('admin', 'admin@example.com', hashedPassword);
  }
  
  if (stationCount.count === 0) {
    const sampleStations = [
      {
        name: 'Downtown Charger',
        latitude: 40.7128,
        longitude: -74.0060,
        status: 'Active',
        power_output: 50,
        connector_type: 'CCS',
        created_by: 1
      },
      {
        name: 'Mall Charging Point',
        latitude: 40.7580,
        longitude: -73.9855,
        status: 'Active',
        power_output: 150,
        connector_type: 'CHAdeMO',
        created_by: 1
      },
      {
        name: 'Highway Station',
        latitude: 40.6892,
        longitude: -74.0445,
        status: 'Inactive',
        power_output: 350,
        connector_type: 'Tesla',
        created_by: 1
      }
    ];
    
    const stmt = db.prepare(`
      INSERT INTO charging_stations (name, latitude, longitude, status, power_output, connector_type, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const station of sampleStations) {
      stmt.run(
        station.name,
        station.latitude,
        station.longitude,
        station.status,
        station.power_output,
        station.connector_type,
        station.created_by
      );
    }
  }
  
  db.close();
};