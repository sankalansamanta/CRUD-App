import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStations, Station } from '../services/stationService';
import { ZapIcon, Gauge, MapPin, Plug } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        setError('Failed to fetch charging stations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Dashboard statistics
  const activeStations = stations.filter(station => station.status === 'Active').length;
  const inactiveStations = stations.filter(station => station.status === 'Inactive').length;
  const totalPower = stations.reduce((sum, station) => sum + station.power_output, 0);
  
  // Group by connector type
  const connectorTypes = stations.reduce((acc, station) => {
    acc[station.connector_type] = (acc[station.connector_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/stations/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Add New Station
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ZapIcon size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Stations</p>
              <p className="text-2xl font-semibold text-gray-900">{stations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <div className="h-6 w-6 flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Stations</p>
              <p className="text-2xl font-semibold text-gray-900">{activeStations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <div className="h-6 w-6 flex items-center justify-center">
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactive Stations</p>
              <p className="text-2xl font-semibold text-gray-900">{inactiveStations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Gauge size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Power</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPower} kW</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Stations and Connector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Stations</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stations.slice(0, 5).map((station) => (
              <div key={station.id} className="px-6 py-4 flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{station.name}</p>
                  <div className="flex items-center mt-1">
                    <MapPin size={14} className="text-gray-500 mr-1" />
                    <p className="text-xs text-gray-500">
                      {station.latitude.toFixed(5)}, {station.longitude.toFixed(5)}
                    </p>
                  </div>
                </div>
                <div className="ml-6 flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      station.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {station.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              to="/stations"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all stations →
            </Link>
          </div>
        </div>

        {/* Connector Types */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Connector Distribution</h3>
          </div>
          <div className="p-6">
            {Object.entries(connectorTypes).map(([type, count], index) => (
              <div key={type} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Plug size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      index % 4 === 0
                        ? 'bg-blue-600'
                        : index % 4 === 1
                        ? 'bg-green-600'
                        : index % 4 === 2
                        ? 'bg-amber-600'
                        : 'bg-purple-600'
                    }`}
                    style={{ width: `${(count / stations.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;