import { getDb } from '../database/init.js';

export const getAllStations = (filters = {}) => {
  const db = getDb();
  
  let query = 'SELECT * FROM charging_stations WHERE 1=1';
  const params = [];
  
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  
  if (filters.connectorType) {
    query += ' AND connector_type = ?';
    params.push(filters.connectorType);
  }
  
  if (filters.minPower) {
    query += ' AND power_output >= ?';
    params.push(filters.minPower);
  }
  
  if (filters.maxPower) {
    query += ' AND power_output <= ?';
    params.push(filters.maxPower);
  }
  
  const stations = db.prepare(query).all(...params);
  db.close();
  return stations;
};

export const getStationById = (id) => {
  const db = getDb();
  const station = db.prepare('SELECT * FROM charging_stations WHERE id = ?').get(id);
  db.close();
  return station;
};

export const createStation = (stationData, userId) => {
  const db = getDb();
  
  try {
    const result = db.prepare(`
      INSERT INTO charging_stations (
        name, latitude, longitude, status, power_output, connector_type, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      stationData.name,
      stationData.latitude,
      stationData.longitude,
      stationData.status,
      stationData.powerOutput,
      stationData.connectorType,
      userId
    );
    
    const station = getStationById(result.lastInsertRowid);
    db.close();
    return station;
  } catch (error) {
    db.close();
    throw error;
  }
};

export const updateStation = (id, stationData) => {
  const db = getDb();
  
  try {
    db.prepare(`
      UPDATE charging_stations
      SET name = ?, latitude = ?, longitude = ?, 
          status = ?, power_output = ?, connector_type = ?
      WHERE id = ?
    `).run(
      stationData.name,
      stationData.latitude,
      stationData.longitude,
      stationData.status,
      stationData.powerOutput,
      stationData.connectorType,
      id
    );
    
    const station = getStationById(id);
    db.close();
    return station;
  } catch (error) {
    db.close();
    throw error;
  }
};

export const deleteStation = (id) => {
  const db = getDb();
  
  try {
    const result = db.prepare('DELETE FROM charging_stations WHERE id = ?').run(id);
    db.close();
    return result.changes > 0;
  } catch (error) {
    db.close();
    throw error;
  }
};