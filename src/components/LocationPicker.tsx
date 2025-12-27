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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className="px-4 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#FF4400] transition-colors font-medium text-sm"
        >
          Use Current Location
        </button>
        <button
          type="button"
          onClick={handleManualInput}
          className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors border border-white/10 text-sm font-medium"
        >
          Manual Input
        </button>
      </div>

      {isManual && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={handleLatChange}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
              placeholder="e.g., 28.6139"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={handleLngChange}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
              placeholder="e.g., 77.2090"
            />
          </div>
        </div>
      )}

      <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400 mb-1">Selected Coordinates:</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="font-mono text-sm text-white">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
            {isManual ? "Manual Mode" : "GPS Mode"}
          </p>
        </div>
      </div>
    </div>
  );
}
