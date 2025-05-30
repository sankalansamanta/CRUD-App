const API_URL = 'http://localhost:3001/api';

interface StationFilters {
  status?: string;
  connectorType?: string;
  minPower?: number;
  maxPower?: number;
}

export interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: 'Active' | 'Inactive';
  power_output: number;
  connector_type: string;
  created_at: string;
}

export interface StationInput {
  name: string;
  latitude: number;
  longitude: number;
  status: 'Active' | 'Inactive';
  powerOutput: number;
  connectorType: string;
}

// Helper to get auth header
const getAuthHeader = (): Record<string, string> => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

// Get all stations with optional filters
export const getStations = async (filters: StationFilters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.connectorType) queryParams.append('connectorType', filters.connectorType);
    if (filters.minPower) queryParams.append('minPower', filters.minPower.toString());
    if (filters.maxPower) queryParams.append('maxPower', filters.maxPower.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/stations${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch stations');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

// Get a single station by ID
export const getStation = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/stations/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch station');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

// Create a new station
export const createStation = async (stationData: StationInput) => {
  try {
    const response = await fetch(`${API_URL}/stations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(stationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create station');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

// Update an existing station
export const updateStation = async (id: number, stationData: StationInput) => {
  try {
    const response = await fetch(`${API_URL}/stations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(stationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update station');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

// Delete a station
export const deleteStation = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/stations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete station');
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};