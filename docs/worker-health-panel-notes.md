# Worker &amp; System Health Panel

## Overview

A SOC operator console page dedicated to monitoring **worker instances**, **supervisor processes**, and **system resources**. Implements R53 / FE-3 chaos hardening visibility — supervisor restarts are shown, never hidden.

## Project Structure

```
worker-health-panel/
├── index.html          # Main HTML file
├── css/
│   └── main.css        # All styles + color schema + animations
├── js/
│   └── app.js          # Application logic + chaos simulation
├── assets/             # Static assets (icons, etc.)
└── README.md           # This file
```

## Color Schema

| Token               | Hex / Value                        | Role                |
|---------------------|------------------------------------|---------------------|
| `--void`            | `#05070d`                          | Base background     |
| `--panel`           | `rgba(12, 16, 34, 0.55)`           | Glass panels        |
| `--panel-solid`     | `#0b0f22`                          | Solid panel bg      |
| `--panel-border`    | `rgba(120, 160, 255, 0.22)`        | Panel hairlines     |
| `--blue`            | `#4da3ff`                          | Primary accent      |
| `--violet`          | `#9b6bff`                          | Secondary accent    |
| `--cyan`            | `#3fe0d6`                          | Live / status       |
| `--amber`           | `#f2a93c`                          | Warning severity    |
| `--danger`          | `#ef5b5b`                          | Alarm severity      |
| `--text-primary`    | `#eef1fa`                          | Primary text        |
| `--text-muted`      | `#8890ac`                          | Muted text          |
| `--text-faint`      | `#535a75`                          | Faint text          |

## Features

### System Overview
- 4 overview cards with embedded sparkline charts (System Status, Active Workers, Throughput, Incidents)
- All cards have 3D tilt effect on mouse hover

### Worker Instances
- Individual cards for each worker (worker-1 through worker-5)
- Each card shows: status, CPU/memory/uptime/restarts, FPS, latency
- Color-coded progress bars (CPU, Memory, Disk)
- Per-worker sparkline chart
- Status indicators: healthy (cyan), degraded (amber), failed (danger), recovering (violet)

### Supervisor Panel
- Live supervisor process status with PID
- Restart count (24h), last restart time, recovery time, next health check countdown
- Visual restart timeline showing each supervisor recovery event

### System Resources
- Real-time CPU, Memory, Disk I/O, Network utilization bars
- Color-coded thresholds (normal → warning → critical)
- Detail specs for each resource

### Cluster Topology
- Visual node map showing supervisor → workers → database connections
- Color-coded nodes matching worker health status
- Interactive hover effects

### Sidebar Panels
- Restart History log with severity dots
- System Alerts feed (critical / warning / info)
- Aggregate Performance gauge (animated SVG ring)
- Read-only Config display (R53 compliance)

### Interactive Controls
- **Refresh** — Re-render all worker data
- **Chaos Test** — Toggle chaos injection mode (randomly degrades a worker, then auto-recovers)
- **Export** — Download health report (modal confirmation)
- **Simulate Failure** — Force worker-3 into crash state
- **3D Tilt Toggle** — Enable/disable perspective effects
- **Fullscreen** — Full-screen mode

### Live Data
- All metrics update every 2-3 seconds
- Resource bars animate smoothly
- Performance gauge ring animates
- Next health check countdown ticks

## Running Locally

```bash
# Option 1: Just open index.html in any browser
open index.html

# Option 2: Serve for network access
python3 -m http.server 8080
```

## Public API (from JS console)

No external API required. All functions are self-contained. The app auto-initializes on DOM ready.

To manually trigger chaos mode:
```javascript
// Simulate a worker degradation + recovery cycle
// (Available when chaos mode is active via the UI button)
```
