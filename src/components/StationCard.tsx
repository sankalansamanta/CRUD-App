import React from 'react';
import { Link } from 'react-router-dom';
import { Station } from '../services/stationService';
import { Edit, Trash2, Zap, MapPin } from 'lucide-react';

interface StationCardProps {
  station: Station;
  onDelete: (id: number) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{station.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              station.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {station.status}
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">
              {station.latitude.toFixed(5)}, {station.longitude.toFixed(5)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Zap size={16} className="mr-2" />
            <span className="text-sm">{station.power_output} kW</span>
          </div>
          
          <div className="mt-1 text-sm text-gray-600">
            <span className="font-medium">Connector:</span> {station.connector_type}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <Link
          to={`/stations/edit/${station.id}`}
          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
        >
          <Edit size={16} className="mr-1" />
          Edit
        </Link>
        
        <button
          onClick={() => onDelete(station.id)}
          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default StationCard;