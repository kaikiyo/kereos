:root {
  --bg-dark: #07070e;
  --bg-card: rgba(18, 18, 32, 0.65);
  --bg-card-hover: rgba(28, 28, 48, 0.75);
  --border-glass: rgba(138, 43, 226, 0.2);
  --border-glass-glow: rgba(138, 43, 226, 0.5);
  --accent-purple: #8a2be2;
  --accent-neon: #a855f7;
  --accent-cyan: #06b6d4;
  --green-bull: #10b981;
  --green-glow: rgba(16, 185, 129, 0.3);
  --red-bear: #ef4444;
  --red-glow: rgba(239, 68, 68, 0.3);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --font-mono: 'JetBrains Mono', monospace, sans-serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: var(--font-sans);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* Background Particle Glow Canvas */
#bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Navigation */
.sidebar {
  width: 260px;
  background: rgba(10, 10, 20, 0.85);
  backdrop-filter: blur(16px);
  border-right: 1px solid var(--border-glass);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  z-index: 50;
  transition: transform 0.3s ease;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-left: 0.5rem;
}

.brand svg {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 8px var(--accent-neon));
}

.brand-text h1 {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff, var(--accent-neon));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-text span {
  font-size: 0.65rem;
  color: var(--accent-cyan);
  letter-spacing: 1px;
  font-weight: 600;
  display: block;
}

.nav-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-link:hover, .nav-link.active {
  color: var(--text-main);
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid var(--border-glass);
}

.nav-link.active {
  border-left: 3px solid var(--accent-neon);
}

/* Main Content Area */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.top-bar {
  height: 70px;
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--green-glow);
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  color: var(--green-bull);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--green-bull);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--green-bull);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.top-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.select-box, .btn-action {
  background: rgba(20, 20, 35, 0.8);
  border: 1px solid var(--border-glass);
  color: var(--text-main);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  outline: none;
  font-size: 0.85rem;
  cursor: pointer;
}

/* Content Views */
.content-area {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.view-page {
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

.view-page.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Dashboard & Cards Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.card {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.card:hover {
  border-color: var(--border-glass-glow);
  transform: translateY(-2px);
}

.card-title {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-mono);
}

.val-up { color: var(--green-bull); }
.val-down { color: var(--red-bear); }

/* Trading Chart Container */
.chart-container {
  position: relative;
  width: 100%;
  height: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

canvas#trading-chart {
  width: 100%;
  height: 100%;
}

/* Markets Table & Asset Cards */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th, .data-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table th {
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.asset-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}

.asset-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal {
  background: #0f0f1c;
  border: 1px solid var(--border-glass-glow);
  width: 100%;
  max-width: 420px;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
}

.pct-group {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.btn-pct {
  flex: 1;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-glass);
  color: var(--text-main);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-pct:hover {
  background: rgba(168, 85, 247, 0.2);
  border-color: var(--accent-neon);
}

.btn-submit {
  width: 100%;
  padding: 0.85rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: transform 0.1s ease;
}

.btn-buy { background: var(--green-bull); color: #000; }
.btn-sell { background: var(--red-bear); color: #fff; }
.btn-submit:active { transform: scale(0.98); }

/* Toast Notifications */
#toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  background: rgba(15, 15, 30, 0.95);
  border-left: 4px solid var(--accent-neon);
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  font-size: 0.85rem;
  animation: slideIn 0.3s forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Mobile Responsive */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-main);
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .mobile-toggle {
    display: block;
  }
}
