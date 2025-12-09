// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Format percentage
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Format time ago
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Format date
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate public key for display
export function truncateKey(key: string, chars: number = 4): string {
  if (key.length <= chars * 2 + 3) return key;
  return `${key.slice(0, chars)}...${key.slice(-chars)}`;
}

// Format stake amount
export function formatStake(lamports: number): string {
  const sol = lamports / 1e9;
  if (sol >= 1e6) return `${(sol / 1e6).toFixed(2)}M`;
  if (sol >= 1e3) return `${(sol / 1e3).toFixed(2)}K`;
  return sol.toFixed(2);
}

// Calculate epoch progress percentage
export function calculateEpochProgress(slotIndex: number, slotsInEpoch: number): number {
  return (slotIndex / slotsInEpoch) * 100;
}

// Generate gradient color based on value (0-100)
export function getGradientColor(value: number): string {
  if (value >= 99) return '#22c55e'; // green
  if (value >= 95) return '#14b8a6'; // teal
  if (value >= 90) return '#3b82f6'; // blue
  if (value >= 80) return '#eab308'; // yellow
  return '#ef4444'; // red
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
