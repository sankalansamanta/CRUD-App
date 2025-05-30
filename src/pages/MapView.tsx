import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getStations, Station } from '../services/stationService';
import { Link } from 'react-router-dom';
import { Zap, MapPin } from 'lucide-react';

// Fix the icon issue with Leaflet in React
const markerIconActive = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const markerIconInactive = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A component to set the view of the map
const SetViewOnStations = ({ stations }: { stations: Station[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (stations.length > 0) {
      // Create bounds from all station coordinates
      const bounds = stations.map(station => [station.latitude, station.longitude]);
      map.fitBounds(bounds as [number, number][]);
    }
  }, [stations, map]);
  
  return null;
};

const MapView: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const data = await getStations(
          activeFilter ? { status: activeFilter } : {}
        );
        setStations(data);
      } catch (err) {
        setError('Failed to fetch charging stations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [activeFilter]);

  // Default center (will be overridden by SetViewOnStations)
  const defaultCenter = [40.7128, -74.0060] as [number, number];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Map View</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeFilter === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('Active')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeFilter === 'Active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('Inactive')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeFilter === 'Inactive'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '70vh' }}>
          <MapContainer
            center={defaultCenter}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <SetViewOnStations stations={stations} />
            
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.latitude, station.longitude]}
                icon={station.status === 'Active' ? markerIconActive : markerIconInactive}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{station.name}</h3>
                    <div className="my-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          station.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {station.status}
                      </span>
                    </div>
                    <div className="text-sm my-1">
                      <div className="flex items-center justify-center">
                        <Zap size={14} className="mr-1" />
                        <span>{station.power_output} kW</span>
                      </div>
                      <div className="mt-1">
                        <span className="font-medium">Connector:</span> {station.connector_type}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link
                        to={`/stations/edit/${station.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit Station →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <p className="text-sm font-medium">Active Stations</p>
          </div>
          <p className="text-2xl font-bold">
            {stations.filter(s => s.status === 'Active').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <p className="text-sm font-medium">Inactive Stations</p>
          </div>
          <p className="text-2xl font-bold">
            {stations.filter(s => s.status === 'Inactive').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <MapPin size={16} className="text-blue-500 mr-2" />
            <p className="text-sm font-medium">Total Stations</p>
          </div>
          <p className="text-2xl font-bold">{stations.length}</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;