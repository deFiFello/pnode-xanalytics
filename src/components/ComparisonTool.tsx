'use client';

import { useState, useMemo } from 'react';
import { X, Scale, Server, TrendingUp, HardDrive, Percent, Users } from 'lucide-react';
import type { PNode, ComparisonWeights } from '@/types';
import { formatBytes, formatPercent, formatStake, getGradientColor } from '@/lib/utils';

interface ComparisonToolProps {
  nodes: PNode[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const DEFAULT_WEIGHTS: ComparisonWeights = {
  uptime: 30,
  performance: 25,
  storage: 15,
  fee: 20,
  stake: 10,
};

export function ComparisonTool({ nodes, selectedIds, onRemove, onClear }: ComparisonToolProps) {
  const [weights, setWeights] = useState<ComparisonWeights>(DEFAULT_WEIGHTS);
  
  const selectedNodes = useMemo(() => 
    nodes.filter(n => selectedIds.includes(n.id)),
    [nodes, selectedIds]
  );

  // Calculate weighted score for each node
  const scoredNodes = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    
    return selectedNodes.map(node => {
      // Normalize each metric to 0-100 scale
      const uptimeScore = node.uptime;
      const performanceScore = node.performanceScore;
      const storageScore = Math.min(100, (node.storage.dedicated / (10 * 1024 ** 4)) * 100); // 10TB = 100
      const feeScore = 100 - node.fee * 10; // Lower fee = higher score
      const stakeScore = Math.min(100, (node.totalStake / (200000 * 1e9)) * 100); // 200k XAND = 100
      
      const weightedScore = (
        (uptimeScore * weights.uptime) +
        (performanceScore * weights.performance) +
        (storageScore * weights.storage) +
        (feeScore * weights.fee) +
        (stakeScore * weights.stake)
      ) / totalWeight;
      
      return {
        ...node,
        weightedScore,
        scores: {
          uptime: uptimeScore,
          performance: performanceScore,
          storage: storageScore,
          fee: feeScore,
          stake: stakeScore,
        }
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  }, [selectedNodes, weights]);

  const handleWeightChange = (key: keyof ComparisonWeights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  if (selectedIds.length === 0) {
    return null;
  }

  const winner = scoredNodes[0];

  return (
    <div className="bg-xand-card border border-xand-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-xand-dark/50 border-b border-xand-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-xand-purple/20">
            <Scale className="h-5 w-5 text-xand-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-xand-text">Comparison Tool</h3>
            <p className="text-sm text-xand-text-dim">{selectedIds.length} nodes selected</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-xand-text-dim hover:text-xand-text px-3 py-1.5 rounded-lg border border-xand-border hover:border-xand-red/50 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Weight sliders */}
      <div className="px-6 py-4 border-b border-xand-border bg-xand-dark/30">
        <p className="text-sm text-xand-text-dim mb-3">Adjust weights based on your priorities:</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <WeightSlider
            label="Uptime"
            value={weights.uptime}
            onChange={(v) => handleWeightChange('uptime', v)}
            color="green"
          />
          <WeightSlider
            label="Performance"
            value={weights.performance}
            onChange={(v) => handleWeightChange('performance', v)}
            color="teal"
          />
          <WeightSlider
            label="Storage"
            value={weights.storage}
            onChange={(v) => handleWeightChange('storage', v)}
            color="blue"
          />
          <WeightSlider
            label="Low Fee"
            value={weights.fee}
            onChange={(v) => handleWeightChange('fee', v)}
            color="yellow"
          />
          <WeightSlider
            label="Stake"
            value={weights.stake}
            onChange={(v) => handleWeightChange('stake', v)}
            color="purple"
          />
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-xand-border bg-xand-dark/30">
              <th className="text-left text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-6 py-3">pNode</th>
              <th className="text-center text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">Weighted Score</th>
              <th className="text-center text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">Uptime</th>
              <th className="text-center text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">Performance</th>
              <th className="text-center text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">Storage</th>
              <th className="text-center text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">Fee</th>
              <th className="text-center text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">Stake</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {scoredNodes.map((node, index) => (
              <tr 
                key={node.id} 
                className={`border-b border-xand-border ${index === 0 ? 'bg-xand-green/5' : ''}`}
              >
                {/* pNode */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-xand-green/20 text-xand-green rounded">
                        BEST
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-xand-teal/20 to-xand-blue/20 flex items-center justify-center">
                      <Server className="h-4 w-4 text-xand-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-xand-text">{node.name}</p>
                      <p className="text-xs text-xand-text-muted">#{node.rank}</p>
                    </div>
                  </div>
                </td>

                {/* Weighted Score */}
                <td className="px-4 py-4 text-center">
                  <span 
                    className="text-xl font-bold"
                    style={{ color: getGradientColor(node.weightedScore) }}
                  >
                    {node.weightedScore.toFixed(1)}
                  </span>
                </td>

                {/* Uptime */}
                <td className="px-4 py-4 text-center">
                  <MetricCell value={node.uptime} label={formatPercent(node.uptime)} />
                </td>

                {/* Performance */}
                <td className="px-4 py-4 text-center">
                  <MetricCell value={node.performanceScore} label={node.performanceScore.toFixed(1)} />
                </td>

                {/* Storage */}
                <td className="px-4 py-4 text-center">
                  <MetricCell value={node.scores.storage} label={formatBytes(node.storage.dedicated)} />
                </td>

                {/* Fee */}
                <td className="px-4 py-4 text-center">
                  <MetricCell value={node.scores.fee} label={formatPercent(node.fee)} inverted />
                </td>

                {/* Stake */}
                <td className="px-4 py-4 text-center">
                  <MetricCell value={node.scores.stake} label={formatStake(node.totalStake)} />
                </td>

                {/* Remove */}
                <td className="px-4 py-4">
                  <button
                    onClick={() => onRemove(node.id)}
                    className="p-1.5 rounded-lg text-xand-text-muted hover:text-xand-red hover:bg-xand-red/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendation */}
      {scoredNodes.length >= 2 && (
        <div className="px-6 py-4 bg-xand-green/5 border-t border-xand-green/20">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-xand-green" />
            <p className="text-sm text-xand-text">
              <span className="font-semibold text-xand-green">{winner.name}</span> scores highest based on your priorities, 
              with a weighted score of <span className="font-mono font-semibold">{winner.weightedScore.toFixed(1)}</span> — 
              <span className="font-mono"> {(winner.weightedScore - scoredNodes[1].weightedScore).toFixed(1)}</span> points ahead of {scoredNodes[1].name}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: 'green' | 'teal' | 'blue' | 'yellow' | 'purple';
}

function WeightSlider({ label, value, onChange, color }: WeightSliderProps) {
  const colorClasses = {
    green: 'accent-xand-green',
    teal: 'accent-xand-teal',
    blue: 'accent-xand-blue',
    yellow: 'accent-xand-yellow',
    purple: 'accent-xand-purple',
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-xand-text-dim">{label}</span>
        <span className="text-xand-text font-mono">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="50"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-1.5 bg-xand-border rounded-full appearance-none cursor-pointer ${colorClasses[color]}`}
      />
    </div>
  );
}

interface MetricCellProps {
  value: number;
  label: string;
  inverted?: boolean;
}

function MetricCell({ value, label, inverted }: MetricCellProps) {
  // For fee, lower is better so we use inverted color logic
  const displayValue = inverted ? 100 - value : value;
  
  return (
    <div className="space-y-1">
      <span className="text-sm font-mono text-xand-text">{label}</span>
      <div className="w-full h-1 bg-xand-dark/50 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all"
          style={{ 
            width: `${value}%`,
            backgroundColor: getGradientColor(displayValue)
          }}
        />
      </div>
    </div>
  );
}
