import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StationForm from '../components/StationForm';
import { getStation, updateStation, StationInput } from '../services/stationService';

const EditStation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<StationInput | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setFetchLoading(true);
        const station = await getStation(Number(id));
        
        setInitialValues({
          name: station.name,
          latitude: station.latitude,
          longitude: station.longitude,
          status: station.status,
          powerOutput: station.power_output,
          connectorType: station.connector_type
        });
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Failed to fetch station details');
  }
} finally {
  setFetchLoading(false);
}
};

    if (id) {
      fetchStation();
    }
  }, [id]);

  const handleSubmit = async (data: StationInput) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      await updateStation(Number(id), data);
      navigate('/stations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update station');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Charging Station</h1>
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
        {initialValues && (
          <StationForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default EditStation;