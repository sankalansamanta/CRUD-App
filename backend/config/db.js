import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'evcharging',
  password: process.env.DB_PASSWORD || 'Riju@1234',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize database tables
export const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create charging stations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS charging_stations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        status VARCHAR(20) CHECK (status IN ('Active', 'Inactive')) NOT NULL,
        power_output DECIMAL(10, 2) NOT NULL,
        connector_type VARCHAR(50) NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if admin user exists
    const adminExists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    // Create admin user if not exists
    if (adminExists.rows.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await client.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        ['admin', 'admin@example.com', hashedPassword]
      );
    }
    
    // Add sample stations if none exist
    const stationsExist = await client.query('SELECT COUNT(*) FROM charging_stations');
    
    if (parseInt(stationsExist.rows[0].count) === 0) {
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
      
      for (const station of sampleStations) {
        await client.query(`
          INSERT INTO charging_stations 
          (name, latitude, longitude, status, power_output, connector_type, created_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          station.name,
          station.latitude,
          station.longitude,
          station.status,
          station.power_output,
          station.connector_type,
          station.created_by
        ]);
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;