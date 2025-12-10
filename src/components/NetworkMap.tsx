'use client';

import { useMemo } from 'react';
import { Globe, MapPin } from 'lucide-react';
import type { PNode } from '@/types';

interface NetworkMapProps {
  nodes: PNode[];
}

// Simplified world map coordinates for major regions
const REGION_POSITIONS: Record<string, { x: number; y: number }> = {
  // North America
  'USA': { x: 22, y: 38 },
  'Canada': { x: 20, y: 30 },
  'Mexico': { x: 18, y: 48 },
  
  // Europe
  'Germany': { x: 52, y: 32 },
  'Netherlands': { x: 50, y: 30 },
  'France': { x: 48, y: 35 },
  'UK': { x: 46, y: 28 },
  'Switzerland': { x: 51, y: 35 },
  'Sweden': { x: 54, y: 24 },
  'Finland': { x: 58, y: 22 },
  'Poland': { x: 56, y: 32 },
  'Spain': { x: 46, y: 40 },
  'Italy': { x: 53, y: 38 },
  
  // Asia
  'Japan': { x: 85, y: 38 },
  'Singapore': { x: 76, y: 58 },
  'South Korea': { x: 82, y: 38 },
  'China': { x: 75, y: 40 },
  'India': { x: 68, y: 48 },
  'Hong Kong': { x: 78, y: 46 },
  'Taiwan': { x: 80, y: 46 },
  
  // Oceania
  'Australia': { x: 84, y: 72 },
  'New Zealand': { x: 92, y: 78 },
  
  // South America
  'Brazil': { x: 32, y: 65 },
  'Argentina': { x: 30, y: 78 },
  'Chile': { x: 28, y: 76 },
  
  // Africa
  'South Africa': { x: 56, y: 75 },
  'Nigeria': { x: 50, y: 55 },
  
  // Middle East
  'UAE': { x: 64, y: 48 },
  'Israel': { x: 58, y: 42 },
};

export function NetworkMap({ nodes }: NetworkMapProps) {
  // Group nodes by country
  const nodesByCountry = useMemo(() => {
    const grouped: Record<string, PNode[]> = {};
    nodes.forEach(node => {
      const country = node.location?.country || 'Unknown';
      if (!grouped[country]) grouped[country] = [];
      grouped[country].push(node);
    });
    return grouped;
  }, [nodes]);

  // Calculate stats
  const stats = useMemo(() => {
    const countries = new Set(nodes.map(n => n.location?.country).filter(Boolean));
    const onlineNodes = nodes.filter(n => n.online).length;
    return {
      totalCountries: countries.size,
      totalNodes: nodes.length,
      onlineNodes,
    };
  }, [nodes]);

  return (
    <div className="bg-xand-card border border-xand-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-xand-dark/50 border-b border-xand-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-xand-blue/20">
            <Globe className="h-5 w-5 text-xand-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-xand-text">Network Topology</h3>
            <p className="text-sm text-xand-text-dim">Geographic distribution of pNodes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-xand-green" />
            <span className="text-xand-text-dim">{stats.onlineNodes} online</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-xand-text-muted" />
            <span className="text-xand-text-dim">{stats.totalCountries} countries</span>
          </div>
        </div>
      </div>

      {/* Map visualization */}
      <div className="relative p-6">
        {/* World map background (simplified SVG) */}
        <div className="relative w-full aspect-[2/1] bg-xand-dark/30 rounded-lg overflow-hidden">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {/* Horizontal lines */}
            {[20, 40, 60, 80].map(y => (
              <line key={`h-${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1f2937" strokeWidth="1" />
            ))}
            {/* Vertical lines */}
            {[20, 40, 60, 80].map(x => (
              <line key={`v-${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="#1f2937" strokeWidth="1" />
            ))}
          </svg>

          {/* Simplified continent outlines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
            {/* North America */}
            <path 
              d="M5,10 Q15,8 25,12 L28,20 Q22,25 25,35 L15,38 Q8,30 5,20 Z" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="0.3"
            />
            {/* South America */}
            <path 
              d="M20,38 Q28,42 30,48 L25,60 Q20,62 18,55 L20,45 Z" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="0.3"
            />
            {/* Europe */}
            <path 
              d="M42,12 Q50,10 55,12 L58,18 Q52,22 48,20 Z" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="0.3"
            />
            {/* Africa */}
            <path 
              d="M42,25 Q52,22 58,28 L55,45 Q48,48 45,42 L42,30 Z" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="0.3"
            />
            {/* Asia */}
            <path 
              d="M58,8 Q75,5 90,15 L88,28 Q78,32 65,25 L60,18 Z" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="0.3"
            />
            {/* Australia */}
            <path 
              d="M78,38 Q88,36 92,42 L88,48 Q82,50 78,45 Z" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="0.3"
            />
          </svg>

          {/* Node markers */}
          {Object.entries(nodesByCountry).map(([country, countryNodes]) => {
            const pos = REGION_POSITIONS[country];
            if (!pos) return null;

            const onlineCount = countryNodes.filter(n => n.online).length;
            const totalCount = countryNodes.length;
            const allOnline = onlineCount === totalCount;

            return (
              <div
                key={country}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {/* Pulse effect for online nodes */}
                {allOnline && (
                  <div className="absolute inset-0 w-4 h-4 -m-1 rounded-full bg-xand-teal/30 animate-ping" />
                )}
                
                {/* Main dot */}
                <div 
                  className={`w-3 h-3 rounded-full border-2 ${
                    allOnline 
                      ? 'bg-xand-teal border-xand-teal shadow-lg shadow-xand-teal/30' 
                      : onlineCount > 0 
                        ? 'bg-xand-yellow border-xand-yellow' 
                        : 'bg-xand-red border-xand-red'
                  }`}
                />

                {/* Count badge */}
                {totalCount > 1 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-xand-card border border-xand-border flex items-center justify-center">
                    <span className="text-[8px] font-bold text-xand-text">{totalCount}</span>
                  </div>
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-xand-card border border-xand-border rounded-lg p-2 shadow-xl whitespace-nowrap">
                    <p className="text-xs font-semibold text-xand-text">{country}</p>
                    <p className="text-xs text-xand-text-dim">
                      {onlineCount}/{totalCount} online
                    </p>
                    <div className="text-xs text-xand-text-muted mt-1">
                      {countryNodes.slice(0, 3).map(n => n.name || 'Unknown').join(', ')}
                      {countryNodes.length > 3 && ` +${countryNodes.length - 3}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Connection lines (simplified mesh visualization) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            {Object.entries(nodesByCountry).map(([country1, nodes1], i) => {
              const pos1 = REGION_POSITIONS[country1];
              if (!pos1) return null;

              return Object.entries(nodesByCountry).slice(i + 1).map(([country2]) => {
                const pos2 = REGION_POSITIONS[country2];
                if (!pos2) return null;

                // Only draw some connections to avoid clutter
                const distance = Math.sqrt(
                  Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
                );
                if (distance > 30) return null;

                return (
                  <line
                    key={`${country1}-${country2}`}
                    x1={`${pos1.x}%`}
                    y1={`${pos1.y}%`}
                    x2={`${pos2.x}%`}
                    y2={`${pos2.y}%`}
                    stroke="#14b8a6"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                );
              });
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-xand-text-dim">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-xand-teal" />
            <span>All Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-xand-yellow" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-xand-red" />
            <span>Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
