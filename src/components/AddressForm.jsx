import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaCheck } from 'react-icons/fa';
import { apiFetch } from '../config/api.js';

const AddressForm = ({ addresses, selectedAddress, onSelectAddress, onAddressCreated, userId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    latitude: null,
    longitude: null,
    is_default: false
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          // Reverse geocode to get address (will handle loading state)
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationLoading(false);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      setLocationLoading(true);
      
      // Try multiple geocoding services for better accuracy
      // Method 1: OpenStreetMap Nominatim with high zoom
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'GawriGanga-Website/1.0'
          }
        }
      );
      const nominatimData = await nominatimResponse.json();
      
      // Method 2: Try BigDataCloud API (free, good for India)
      let bigDataCloudData = null;
      try {
        const bdcResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        bigDataCloudData = await bdcResponse.json();
      } catch (e) {
        // Fallback if BigDataCloud fails
      }
      
      // Extract and validate postal code from structured fields only
      // Must be exactly 6 numeric digits for Indian PIN codes
      const validatePostalCode = (code) => {
        if (!code) return '';
        const codeStr = String(code).trim();
        return /^\d{6}$/.test(codeStr) ? codeStr : '';
      };
      
      let postalCode = '';
      // Prefer BigDataCloud postal code first
      if (bigDataCloudData?.postcode) {
        postalCode = validatePostalCode(bigDataCloudData.postcode);
      }
      // Fallback to Nominatim if BigDataCloud didn't provide valid code
      if (!postalCode && nominatimData?.address?.postcode) {
        postalCode = validatePostalCode(nominatimData.address.postcode);
      }
      
      // Use Nominatim data for address fields
      if (nominatimData?.address) {
        setFormData(prev => ({
          ...prev,
          address_line1: nominatimData.address.road || nominatimData.address.house_number || nominatimData.address.house || '',
          address_line2: nominatimData.address.house_number && nominatimData.address.road ? nominatimData.address.house_number : '',
          city: nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || nominatimData.address.municipality || nominatimData.address.suburb || '',
          state: nominatimData.address.state || nominatimData.address.region || '',
          postal_code: postalCode,
          country: nominatimData.address.country || 'India'
        }));
      } else if (bigDataCloudData) {
        // Fallback to BigDataCloud if Nominatim fails
        // postalCode is already validated above
        setFormData(prev => ({
          ...prev,
          address_line1: bigDataCloudData.locality || bigDataCloudData.principalSubdivision || '',
          city: bigDataCloudData.city || bigDataCloudData.locality || '',
          state: bigDataCloudData.principalSubdivision || '',
          postal_code: postalCode,
          country: bigDataCloudData.countryName || 'India'
        }));
      }
    } catch (error) {
      // Silently fail - user can enter address manually
    } finally {
      setLocationLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch('/api/addresses', {
        method: 'POST',
        body: JSON.stringify({
          ...formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        alert(errorData.message || errorData.error || `Failed to create address (Status: ${response.status})`);
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        onAddressCreated(result.data);
        setShowForm(false);
        setFormData({
          receiver_name: '',
          receiver_phone: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India',
          latitude: null,
          longitude: null,
          is_default: false
        });
      } else {
        alert(result.message || result.error || 'Failed to create address');
      }
    } catch (error) {
      alert(`Failed to create address: ${error.message || 'Please check your connection and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Select Delivery Address</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FaPlus />
          {showForm ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {/* Existing Addresses */}
      {!showForm && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="font-semibold text-gray-900">{address.receiver_name}</span>
                    {address.is_default && (
                      <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.receiver_phone}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </p>
                  <p className="text-sm text-gray-700">
                    {address.city}, {address.state} - {address.postal_code}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>
                {selectedAddress?.id === address.id && (
                  <FaCheck className="text-primary text-xl" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border-2 border-primary/30 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Add New Address</h4>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <FaMapMarkerAlt />
              {locationLoading ? 'Getting Location...' : 'Use Current Location'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receiver Name *
              </label>
              <input
                type="text"
                name="receiver_name"
                value={formData.receiver_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="receiver_phone"
                value={formData.receiver_phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_default"
              id="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && addresses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FaMapMarkerAlt className="text-4xl mx-auto mb-3 text-gray-300" />
          <p>No addresses found. Please add an address to continue.</p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;

