// components/ui/telemetry-display.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Compass, Zap, Radio, Eye } from 'lucide-react';
import type { TelemetryData } from '@/types/conspiracy';

interface TelemetryDisplayProps {
  updateInterval?: number;
  showAllMetrics?: boolean;
}

const TelemetryDisplay: React.FC<TelemetryDisplayProps> = ({ 
  updateInterval = 2000,
  showAllMetrics = true 
}) => {
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    latitude: 40.7128,
    longitude: -74.0060,
    altitude: 1340,
    bearing: 127,
    velocity: 0,
    signalStrength: -42
  });

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTelemetryData(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0001,
        altitude: Math.max(1000, Math.min(2000, prev.altitude + (Math.random() - 0.5) * 50)),
        bearing: (prev.bearing + Math.random() * 4 - 2 + 360) % 360,
        velocity: Math.max(0, Math.min(10, prev.velocity + (Math.random() - 0.5) * 2)),
        signalStrength: Math.max(-80, Math.min(-20, prev.signalStrength + (Math.random() - 0.5) * 10))
      }));
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval, isActive]);

  const getSignalQuality = (strength: number) => {
    if (strength > -40) return { label: 'EXCELLENT', color: 'text-green-400' };
    if (strength > -60) return { label: 'GOOD', color: 'text-yellow-400' };
    return { label: 'POOR', color: 'text-red-400' };
  };

  const signalQuality = getSignalQuality(telemetryData.signalStrength);

  return (
    <div className="bg-gray-900 border border-green-400/30 rounded-none p-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-400/30">
        <div className="text-green-400 font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          TELEMETRY
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`text-xs px-2 py-1 border rounded ${
            isActive 
              ? 'border-green-400 text-green-400 bg-green-900/20' 
              : 'border-gray-500 text-gray-500'
          }`}
        >
          {isActive ? 'ACTIVE' : 'PAUSED'}
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-blue-400" />
          <div className="grid grid-cols-2 gap-4 flex-1 text-green-300">
            <div>LAT: {telemetryData.latitude.toFixed(4)}°</div>
            <div>LON: {telemetryData.longitude.toFixed(4)}°</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Compass className="w-3 h-3 text-yellow-400" />
          <div className="grid grid-cols-2 gap-4 flex-1 text-green-300">
            <div>ALT: {Math.round(telemetryData.altitude)}m</div>
            <div>BRG: {telemetryData.bearing.toFixed(1)}°</div>
          </div>
        </div>
      </div>

      {showAllMetrics && (
        <>
          {/* Secondary Metrics */}
          <div className="space-y-2 mb-4 pb-3 border-b border-green-400/30">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-purple-400" />
              <div className="flex-1 text-green-300">
                VEL: {telemetryData.velocity.toFixed(2)} m/s
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Radio className="w-3 h-3 text-orange-400" />
              <div className="flex-1">
                <span className="text-green-300">
                  SIG: {telemetryData.signalStrength.toFixed(0)} dBm
                </span>
                <span className={`ml-2 text-xs ${signalQuality.color}`}>
                  {signalQuality.label}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-400/70">GPS LOCK:</span>
              <span className="text-green-400 animate-pulse">ACTIVE</span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-400/70">ENCRYPTION:</span>
              <span className="text-green-400">AES-256</span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-400/70">STEALTH MODE:</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-green-400 animate-pulse" />
                <span className="text-green-400">ENABLED</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Data Stream Simulation */}
      <div className="mt-3 pt-2 border-t border-green-400/30">
        <div className="text-green-400/50 text-xs font-bold mb-1">DATA STREAM:</div>
        <div className="text-green-400/70 text-xs font-mono leading-tight">
          {isActive ? (
            <div className="animate-pulse">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i}>
                  {Math.random().toString(16).substring(2, 8).toUpperCase()} 
                  {Math.random().toString(16).substring(2, 8).toUpperCase()}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">NO SIGNAL</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemetryDisplay;