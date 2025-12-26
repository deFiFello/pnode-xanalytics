# Pnode Xanalytics

**Community analytics platform for Xandeum pNode network**

🌐 **Live Demo:** [pnode-xanalytics.vercel.app](https://pnode-xanalytics.vercel.app)

---

## Overview

Pnode Xanalytics helps XAND token holders find the best pNode validators to delegate to. The platform retrieves real-time data from the Xandeum network and presents it in an intuitive, educational interface.

## Features

### ✅ Real-Time pNode Data
- Live data from **212+ active pNodes** via podcredits.xandeum.network API
- **Credits ranking** — see which nodes are most active
- Network-wide statistics: total nodes, total credits, current epoch

### ✅ Market Data
- Live XAND price from CoinGecko
- 24h price change
- Market cap (circulating supply)

### ✅ Educational Content
- **What is a pNode?** — Simple 3-step explanation
- **STOINC Distribution** — 94/3/3 pie chart with official formula
- **XAND Tokenomics** — Total supply, circulating %, how to buy
- **How to Delegate** — Clear path via Discord/XFDP

### ✅ Tools
- **Search** — Find any node by address
- **Comparison Tool** — Select up to 5 nodes side-by-side
- **Expandable Details** — Click any row for full address + copy function
- **Load More** — Paginated view starting with top 10

---

## Data Sources

| Data | Source | Live |
|------|--------|------|
| pNode list & credits | `podcredits.xandeum.network/api/pods-credits` | ✅ |
| XAND price & market cap | CoinGecko API | ✅ |
| Epoch info | Xandeum DevNet RPC | ✅ |

All data is fetched in real-time with no mock/simulated values.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/deFiFello/pnode-xanalytics.git
cd pnode-xanalytics

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── api/pnodes/route.ts   # API proxy for pNode data
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── NetworkOverview.tsx   # Stats header
│   ├── Leaderboard.tsx       # Node table + education tabs
│   ├── ComparisonTool.tsx    # Side-by-side comparison
│   └── Footer.tsx            # Links footer
```

---

## Bounty Criteria Addressed

| Criteria | Implementation |
|----------|----------------|
| **Functionality** | Retrieves real pNode data via API, displays credits and rankings |
| **Clarity** | Clean UI with explanatory headers, educational tabs |
| **User Experience** | Search, comparison tool, expandable rows, load more pagination |
| **Innovation** | STOINC education, tokenomics display, delegation guidance |

---

## Links

- **Live Site:** https://pnode-xanalytics.vercel.app
- **GitHub:** https://github.com/deFiFello/pnode-xanalytics
- **Xandeum Docs:** https://docs.xandeum.network
- **Xandeum Discord:** https://discord.gg/xandeum

---

## License

MIT

---

Built for the Xandeum pNode Analytics Bounty • December 2025
