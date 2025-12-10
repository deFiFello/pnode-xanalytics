'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface PerformanceChartProps {
  data: { date: string; uptime: number; performance: number; challenges: number }[];
  height?: number;
}

export function PerformanceChart({ data, height = 150 }: PerformanceChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#1f2937' }}
          />
          <YAxis 
            domain={[90, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#1f2937' }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="uptime"
            stroke="#14b8a6"
            strokeWidth={2}
            fill="url(#uptimeGradient)"
            name="Uptime"
          />
          <Area
            type="monotone"
            dataKey="performance"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#performanceGradient)"
            name="Performance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  return (
    <div className="bg-xand-card border border-xand-border rounded-lg p-3 shadow-xl">
      <p className="text-xs text-xand-text-dim mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xand-text-dim">{entry.name}:</span>
          <span className="font-mono text-xand-text">{entry.value.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
}

// Generate mock historical data for a node
export function generateHistoricalData(
  baseUptime: number,
  basePerformance: number,
  days: number = 30
): { date: string; uptime: number; performance: number; challenges: number }[] {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some realistic variance
    const uptimeVariance = (Math.random() - 0.5) * 2;
    const perfVariance = (Math.random() - 0.5) * 3;
    
    // Simulate occasional dips
    const hasIssue = Math.random() > 0.92;
    const issuePenalty = hasIssue ? Math.random() * 5 : 0;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      uptime: Math.min(100, Math.max(90, baseUptime + uptimeVariance - issuePenalty)),
      performance: Math.min(100, Math.max(85, basePerformance + perfVariance - issuePenalty)),
      challenges: Math.floor(90 + Math.random() * 10),
    });
  }
  
  return data;
}
