import React, { useState, useEffect } from 'react';
import { StationInput } from '../services/stationService';

interface StationFormProps {
  initialValues?: StationInput;
  onSubmit: (data: StationInput) => void;
  isLoading: boolean;
}

const DEFAULT_VALUES: StationInput = {
  name: '',
  latitude: 0,
  longitude: 0,
  status: 'Active',
  powerOutput: 50,
  connectorType: 'CCS',
};

const CONNECTOR_TYPES = ['CCS', 'CHAdeMO', 'Type 2', 'Tesla'];

const StationForm: React.FC<StationFormProps> = ({ 
  initialValues = DEFAULT_VALUES, 
  onSubmit, 
  isLoading 
}) => {
  const [formData, setFormData] = useState<StationInput>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    if (isNaN(formData.powerOutput) || formData.powerOutput <= 0) {
      newErrors.powerOutput = 'Power output must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Station Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.name ? 'border-red-300' : ''
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            step="0.000001"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.latitude ? 'border-red-300' : ''
            }`}
          />
          {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
        </div>
        
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            step="0.000001"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.longitude ? 'border-red-300' : ''
            }`}
          />
          {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
        </div>
        
        <div>
          <label htmlFor="powerOutput" className="block text-sm font-medium text-gray-700">
            Power Output (kW)
          </label>
          <input
            type="number"
            id="powerOutput"
            name="powerOutput"
            value={formData.powerOutput}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.powerOutput ? 'border-red-300' : ''
            }`}
          />
          {errors.powerOutput && <p className="mt-1 text-sm text-red-600">{errors.powerOutput}</p>}
        </div>
        
        <div>
          <label htmlFor="connectorType" className="block text-sm font-medium text-gray-700">
            Connector Type
          </label>
          <select
            id="connectorType"
            name="connectorType"
            value={formData.connectorType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {CONNECTOR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Station'}
        </button>
      </div>
    </form>
  );
};

export default StationForm;