// components/ui/terminal-header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Power, Cpu, HardDrive, Signal, Wifi, AlertTriangle } from 'lucide-react';
import type { SystemStatus } from '@/types/conspiracy';

interface TerminalHeaderProps {
  systemName?: string;
  showTime?: boolean;
  showStatus?: boolean;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ 
  systemName = 'MAINFRAME', 
  showTime = true,
  showStatus = true 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'OPERATIONAL',
    cpu: 94.2,
    memory: 67.8,
    uptime: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate slight fluctuations in system metrics
      setSystemStatus(prev => ({
        ...prev,
        cpu: Math.max(85, Math.min(99, prev.cpu + (Math.random() - 0.5) * 2)),
        memory: Math.max(60, Math.min(85, prev.memory + (Math.random() - 0.5) * 1)),
        uptime: prev.uptime + 1
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-b-2 border-green-400 p-4 pr-24 pt-12 font-mono text-xs">
      <div className="flex justify-between items-center flex-wrap gap-4">
        {/* Left Side - System Status */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Power className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-400">{systemName} ONLINE</span>
          </div>
          
          {showStatus && (
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">
                  CPU: {systemStatus.cpu.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">
                  MEM: {systemStatus.memory.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-green-400" />
                <span className="text-green-400">
                  UP: {formatUptime(systemStatus.uptime)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Time and Connection */}
        <div className="flex items-center gap-6 flex-wrap">
          {showTime && (
            <div className="text-green-400 tabular-nums">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                timeZone: 'UTC'
              })} UTC
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-400">SECURE LINK</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-400">ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-2 pt-2 border-t border-green-400/30">
        <div className="flex justify-between items-center text-xs">
          <div className="text-green-400/70">
            STATUS: <span className={`font-bold ${
              systemStatus.status === 'OPERATIONAL' ? 'text-green-400' : 
              systemStatus.status === 'MAINTENANCE' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {systemStatus.status}
            </span>
          </div>
          <div className="text-green-400/70">
            SESSION: CLASSIFIED // USER: DEEP_THROAT_7
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalHeader;