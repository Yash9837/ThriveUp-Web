"use client";

import { useState, useEffect } from "react";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const [lat, setLat] = useState<number>(latitude || 0);
  const [lng, setLng] = useState<number>(longitude || 0);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      setLat(lat);
      setLng(lng);
      onLocationChange(lat, lng);
    }
  }, [lat, lng, latitude, longitude, onLocationChange]);

  // Handle initial location change callback only once when no initial coordinates
  useEffect(() => {
    if (!latitude && !longitude) {
      onLocationChange(lat, lng);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleManualInput = () => {
    setIsManual(true);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          onLocationChange(newLat, newLng);
          setIsManual(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsManual(true);
        }
      );
    } else {
      setIsManual(true);
    }
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLat = parseFloat(e.target.value);
    if (!isNaN(newLat)) {
      setLat(newLat);
      onLocationChange(newLat, lng);
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLng = parseFloat(e.target.value);
    if (!isNaN(newLng)) {
      setLng(newLng);
      onLocationChange(lat, newLng);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="px-3 py-2 bg-[#FF5900] text-white rounded-md hover:bg-[#FF4400] transition-colors"
        >
          Use Current Location
        </button>
        <button
          type="button"
          onClick={handleManualInput}
          className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Manual Input
        </button>
      </div>

      {isManual && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={handleLatChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF5900] focus:border-[#FF5900]"
              placeholder="e.g., 28.6139"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={handleLngChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF5900] focus:border-[#FF5900]"
              placeholder="e.g., 77.2090"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-sm text-gray-600 mb-2">Selected Coordinates:</p>
        <p className="font-mono text-sm">
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isManual ? "Manual coordinates" : "Current location coordinates"}
        </p>
      </div>
    </div>
  );
}
