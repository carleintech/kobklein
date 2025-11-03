'use client';

import { useEffect, useState } from 'react';
import { usePWA } from '@/contexts/PWAContext';
import { useBackgroundSync } from '@/lib/background-sync';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Download
} from 'lucide-react';

export default function PWAStatusBar() {
  const { isOffline, updateAvailable, acceptUpdate, connectionType, isSlowConnection } = usePWA();
  const { pendingCount, syncProgress, triggerSync } = useBackgroundSync();
  const [showDetails, setShowDetails] = useState(false);

  const getConnectionIcon = () => {
    if (isOffline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
    
    if (isSlowConnection) {
      return <Wifi className="h-4 w-4 text-yellow-500" />;
    }
    
    return <Wifi className="h-4 w-4 text-green-500" />;
  };

  const getConnectionText = () => {
    if (isOffline) {
      return 'Offline';
    }
    
    if (isSlowConnection) {
      return `Slow (${connectionType})`;
    }
    
    return `Online (${connectionType})`;
  };

  const getSyncStatus = () => {
    if (syncProgress) {
      return {
        icon: <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />,
        text: `Syncing ${syncProgress.completed}/${syncProgress.total}`,
        color: 'text-blue-600'
      };
    }
    
    if (pendingCount > 0) {
      return {
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
        text: `${pendingCount} pending`,
        color: 'text-yellow-600'
      };
    }
    
    return {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: 'Synced',
      color: 'text-green-600'
    };
  };

  const syncStatus = getSyncStatus();

  // Auto-hide after 5 seconds if no issues
  useEffect(() => {
    if (!isOffline && !updateAvailable && pendingCount === 0) {
      const timer = setTimeout(() => setShowDetails(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, updateAvailable, pendingCount]);

  // Don't show if everything is normal and not expanded
  if (!showDetails && !isOffline && !updateAvailable && pendingCount === 0) {
    return (
      <button
        onClick={() => setShowDetails(true)}
        className="fixed top-4 right-4 z-40 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {getConnectionIcon()}
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]">
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-gray-900">App Status</h3>
        <button
          onClick={() => setShowDetails(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 mb-2">
        {getConnectionIcon()}
        <span className="text-sm text-gray-700">{getConnectionText()}</span>
      </div>

      {/* Sync Status */}
      <div className="flex items-center gap-2 mb-2">
        {syncStatus.icon}
        <span className={`text-sm ${syncStatus.color}`}>{syncStatus.text}</span>
      </div>

      {/* Update Available */}
      {updateAvailable && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Download className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Update Available</span>
          </div>
          <button
            onClick={acceptUpdate}
            className="w-full bg-blue-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Install Update
          </button>
        </div>
      )}

      {/* Offline Notice */}
      {isOffline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Offline Mode</span>
          </div>
          <p className="text-xs text-yellow-700">
            Your data will sync when connection is restored.
          </p>
        </div>
      )}

      {/* Sync Progress Details */}
      {syncProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-900">Syncing</span>
            <span className="text-xs text-blue-700">
              {syncProgress.completed}/{syncProgress.total}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(syncProgress.completed / syncProgress.total) * 100}%` 
              }}
            />
          </div>
          {syncProgress.current && (
            <p className="text-xs text-blue-700 truncate">
              {syncProgress.current}
            </p>
          )}
        </div>
      )}

      {/* Pending Items */}
      {pendingCount > 0 && !syncProgress && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {pendingCount} Pending
            </span>
            <button
              onClick={() => triggerSync()}
              className="text-blue-600 hover:text-blue-700 text-sm"
              disabled={isOffline}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600">
            {isOffline 
              ? 'Will sync when online' 
              : 'Tap to sync now'
            }
          </p>
        </div>
      )}
    </div>
  );
}