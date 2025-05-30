import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StationForm from '../components/StationForm';
import { createStation, StationInput } from '../services/stationService';

const AddStation: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: StationInput) => {
    try {
      setLoading(true);
      setError(null);
      await createStation(data);
      navigate('/stations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create station');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add New Charging Station</h1>
        <button
          onClick={() => navigate('/stations')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <StationForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default AddStation;