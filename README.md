# Pnode Xanalytics v0.36

Community analytics platform for the Xandeum pNode network. Helps stakers make informed delegation decisions within 60 seconds.

![Version](https://img.shields.io/badge/version-0.36-violet)
![Network](https://img.shields.io/badge/network-DevNet-emerald)

## Features

### Quick Guide - Educational Content
- **How It Works**: Explains STOINC (Storage Income), reward flow, and why there's no fixed APY
- **Key Metrics**: Score, Uptime, Fee, Credits, Total Stake, Delegators - with guidance on what to look for
- **Pick Strategy**: Three approaches - Safe & Steady, Maximize Returns, Support Small Operators

### pNode Leaderboard
- Real-time data from Xandeum's podcredits API
- Sortable by Score, Uptime, Fee
- Top 3 highlighted with badges (Most Active, Best Uptime, Lowest Fee)
- Globe icons for clean node identity display

### Expanded Node Details
- Status: Online indicator, version, credits with activity hints
- Delegation: Fee, total stake, delegators with pool size insights
- Identity: Copy-to-clipboard key, location, explorer link
- 30-Day Performance: Mini sparkline chart

### Smart Calculator
- Uses **actual node data** (total stake, delegators, fee, credits)
- Input your stake amount to see:
  - Your % of the pool
  - Your share after operator fee
  - Estimated daily/monthly STOINC earnings
- Visual progress bars for clear understanding

## Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Data Sources**:
  - `podcredits.xandeum.network` - pNode credits
  - `api.devnet.xandeum.com:8899` - Epoch info
  - `api.coingecko.com` - XAND price

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy to Vercel

```bash
# If you have Vercel CLI
vercel

# Or push to GitHub and connect to Vercel
```

## Changelog

### v0.36 (Current)
- 🔧 Fixed CORS - added API proxy route for podcredits
- 🎨 Refined color palette - purple as accent, not dominant
- 🌍 Globe icons replace "P" circles for node identity
- 📚 Comprehensive Quick Guide with tabs (How It Works, Key Metrics, Pick Strategy)
- 💡 Filled dead space in expanded rows with contextual hints
- 🧮 Smart Calculator uses actual node data for accurate estimates
- 📊 Visual breakdowns showing pool share and fee impact

### v0.35
- Initial redesign attempt

### v0.34
- Awards integrated into leaderboard
- Credits shown for all nodes
- Honest fee calculator (no fake APY)

## Data Sources

| Source | Endpoint | Data |
|--------|----------|------|
| pNode Credits | `podcredits.xandeum.network/api/podcredits` | Activity credits per node |
| Epoch Info | `api.devnet.xandeum.com:8899` | Current epoch |
| XAND Price | `api.coingecko.com/api/v3/simple/price` | USD price, 24h change |

## License

MIT

---

Built for the Xandeum Bounty Competition 🏆
