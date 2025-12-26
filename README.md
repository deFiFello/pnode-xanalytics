# Pnode Xanalytics v0.58.0 — Final Release

**Community analytics platform for Xandeum pNode network stakers**

Live Demo: https://pnode-xanalytics.vercel.app

---

## 🎯 Purpose

Help XAND token stakers identify optimal pNode pools for delegation by providing real-time performance visibility. Answer the key question: *"Which pNode should I delegate to?"*

---

## ✨ Features

### Live Network Data
- **212+ Active pNodes** with real-time credits ranking
- **138+ TB Network Storage** from pRPC integration
- **XAND Price & Market Cap** via CoinGecko
- **Current Epoch** from Xandeum DevNet

### pRPC Integration (Unique!)
- Node version & software info
- Actual uptime duration
- Storage committed per node
- Storage utilization (used vs committed)
- Last seen timestamp
- Public/Private node status

### Network Health Metrics
- Average network uptime
- Total storage utilization percentage
- Version distribution (nodes on latest)
- Public vs private node count

### Per-Node Analytics
- Credits ranking (activity score)
- Reward share calculation
- Storage contribution
- Utilization rate
- Reliability indicators

### Educational Content
- What is a pNode?
- What is STOINC?
- XAND tokenomics
- Staking guide links

### UX Features
- Mobile responsive design
- Search by address
- Compare up to 5 nodes
- Expandable detail view
- Stake calculator
- Copy address button
- Explorer links

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 + TypeScript
- **Styling:** TailwindCSS (ORB Markets-inspired dark theme)
- **Icons:** Lucide React
- **Data Sources:**
  - `podcredits.xandeum.network` - Credits API
  - `pRPC (port 6000)` - Node stats via node-fetch
  - `api.devnet.xandeum.com:8899` - Epoch info
  - `CoinGecko API` - XAND price

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📊 Data Sources

| Metric | Source | Update |
|--------|--------|--------|
| Credits | podcredits API | Real-time |
| Version | pRPC | Real-time |
| Uptime | pRPC | Real-time |
| Storage | pRPC | Real-time |
| XAND Price | CoinGecko | Real-time |
| Epoch | DevNet RPC | Real-time |

---

## 🔗 Links

- [Xandeum Docs](https://docs.xandeum.network)
- [pNode Setup](https://pnodes.xandeum.network)
- [Explorer](https://explorer.xandeum.com)
- [Discord](https://discord.gg/xandeum)
- [Stake XAND](https://stakexand.xandeum.network)

---

## 📝 Version History

- **v0.58** - Final release with pRPC integration, storage utilization, network health metrics
- **v0.57** - pRPC integration working (version, uptime, storage, public/private)
- **v0.56** - Mobile responsive design
- **v0.55** - Final submission with competitor analysis, live indicators

---

Built for **Xandeum pNode Analytics Bounty** | December 2025
