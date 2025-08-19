'use client';

import { useEffect, useState } from 'react';

interface DebugPanelProps {
  searchState: any;
  gamesState: any;
  renderCount: number;
}

export function DebugPanel({ searchState, gamesState, renderCount }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<Array<{ message: string; timestamp: string }>>([]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'D')) {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  useEffect(() => {
    const newLog = {
      message: `Render #${renderCount}`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [...prev.slice(-9), newLog]); // Keep last 10 logs
  }, [renderCount]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-green-400 p-4 rounded-lg border border-green-500 max-w-md max-h-96 overflow-auto z-50 font-mono text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>Render Count:</strong> {renderCount}
        </div>
        
        <div>
          <strong>Search State:</strong>
          <pre className="text-xs mt-1">
            {JSON.stringify(searchState, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Games State:</strong>
          <pre className="text-xs mt-1">
            {JSON.stringify({
              gamesCount: gamesState?.games?.length || 0,
              filteredCount: gamesState?.filteredGames?.length || 0,
              loading: gamesState?.loading || false,
              loadingMore: gamesState?.loadingMore || false,
              currentPage: gamesState?.currentPage || 0,
              hasMore: gamesState?.hasMore || false
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Recent Logs:</strong>
          <div className="mt-1 space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-xs">
                {log.timestamp.split('T')[1].split('.')[0]} - {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
