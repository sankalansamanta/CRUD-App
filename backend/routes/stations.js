import express from 'express';
import { verifyToken } from '../config/auth.js';
import { 
  getAllStations, 
  getStationById, 
  createStation, 
  updateStation, 
  deleteStation 
} from '../models/station.js';

const router = express.Router();

// Get all stations with optional filtering
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      connectorType: req.query.connectorType,
      minPower: req.query.minPower,
      maxPower: req.query.maxPower
    };
    
    const stations = getAllStations(filters);
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get station by ID
router.get('/:id', async (req, res) => {
  try {
    const station = getStationById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new station (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, latitude, longitude, status, powerOutput, connectorType } = req.body;
    
    if (!name || !latitude || !longitude || !status || !powerOutput || !connectorType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const station = createStation({
      name,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType
    }, req.userId);
    
    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update station (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, latitude, longitude, status, powerOutput, connectorType } = req.body;
    
    if (!name || !latitude || !longitude || !status || !powerOutput || !connectorType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingStation = getStationById(req.params.id);
    if (!existingStation) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    const updatedStation = updateStation(req.params.id, {
      name,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType
    });
    
    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete station (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const existingStation = getStationById(req.params.id);
    if (!existingStation) {
      return res.status(404).json({ message: 'Charging station not found' });
    }
    
    const deleted = deleteStation(req.params.id);
    if (deleted) {
      res.json({ message: 'Charging station deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete charging station' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;