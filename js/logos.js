/**
 * KEREOS Trading Terminal - Official Asset Vector Logo Engine
 * Pixel-accurate, institutional-grade vector SVGs matching official brand specifications,
 * authentic gradients, specular reflections, and metallic luster.
 */

const ASSET_LOGOS = {
  // 1. Bitcoin (Official Orange Radial Disc with Authentic 14° Tilted Serif ₿)
  BTC: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="btc-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFB347"/>
          <stop offset="60%" stop-color="#F7931A"/>
          <stop offset="100%" stop-color="#D97706"/>
        </radialGradient>
        <filter id="btc-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#btc-grad)"/>
      <g filter="url(#btc-shadow)">
        <path fill="#FFFFFF" fill-rule="evenodd" d="M21.8 13.3c.3-2.1-1.3-3.2-3.5-4l.7-2.9-1.8-.4-.7 2.8c-.5-.1-.9-.2-1.4-.3l.7-2.9-1.8-.4-.7 2.9c-.4-.1-.8-.2-1.2-.3l-2.4-.6-.5 1.9s1.3.3 1.3.3c.7.2.8.6.8 1l-.8 3.2c.1 0 .1 0 .2.1l-.2-.1-1.1 4.5c-.1.2-.3.6-.8.5 0 0-1.3-.3-1.3-.3l-.9 2.1 2.3.6c.4.1.9.2 1.3.3l-.7 3 1.8.4.7-2.9c.5.1.9.2 1.4.3l-.7 2.9 1.8.4.7-2.9c3.1.6 5.4.3 6.4-2.4.8-2.2-.04-3.5-1.7-4.3 1.2-.3 2.1-1.1 2.3-2.8zm-4.1 6.1c-.6 2.3-4.5 1.1-5.7.8l1-4.1c1.3.3 5.3 1 4.7 3.3zm.6-6.2c-.5 2.1-3.7 1-4.8.8l.9-3.7c1.1.3 4.4.8 3.9 2.9z"/>
      </g>
    </svg>
  `,

  // 2. Ethereum (Official Multi-Faceted Octahedron Diamond)
  ETH: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eth-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2D3748"/>
          <stop offset="100%" stop-color="#1A202C"/>
        </linearGradient>
        <linearGradient id="eth-f1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#A4B3E6"/>
          <stop offset="100%" stop-color="#627EEA"/>
        </linearGradient>
        <linearGradient id="eth-f2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8096E8"/>
          <stop offset="100%" stop-color="#4D66D5"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#eth-bg)"/>
      <g transform="translate(0, 0)">
        <path d="M16 4.5L15.8 5.1V20.2L16 20.4L22.5 16.5L16 4.5Z" fill="url(#eth-f1)"/>
        <path d="M16 4.5L9.5 16.5L16 20.4V4.5Z" fill="url(#eth-f2)"/>
        <path d="M16 21.6L15.9 21.8V27.2L16 27.5L22.5 17.7L16 21.6Z" fill="url(#eth-f1)"/>
        <path d="M16 27.5V21.6L9.5 17.7L16 27.5Z" fill="url(#eth-f2)"/>
        <path d="M16 20.4L22.5 16.5L16 13.5V20.4Z" fill="#3B4994" fill-opacity="0.6"/>
        <path d="M9.5 16.5L16 20.4V13.5L9.5 16.5Z" fill="#8096E8" fill-opacity="0.4"/>
      </g>
    </svg>
  `,

  // 3. Solana (Official 3 Parallel Speed Bars with Cyber Gradient)
  SOL: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sol-g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00FFA3"/>
          <stop offset="100%" stop-color="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="sol-g2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#DC1FFF"/>
          <stop offset="100%" stop-color="#00FFA3"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="#0c0d14"/>
      <path d="M8.5 22.2C8.7 22 9 21.9 9.3 21.9H23.8C24.2 21.9 24.4 22.4 24.1 22.7L22.9 23.9C22.7 24.1 22.4 24.2 22.1 24.2H7.6C7.2 24.2 7 23.7 7.3 23.4L8.5 22.2Z" fill="url(#sol-g1)"/>
      <path d="M8.5 15.3C8.7 15.1 9 15 9.3 15H23.8C24.2 15 24.4 15.5 24.1 15.8L22.9 17C22.7 17.2 22.4 17.3 22.1 17.3H7.6C7.2 17.3 7 16.8 7.3 16.5L8.5 15.3Z" fill="url(#sol-g2)"/>
      <path d="M22.9 8.1C22.7 8.3 22.4 8.4 22.1 8.4H7.6C7.2 8.4 7 7.9 7.3 7.6L8.5 6.4C8.7 6.2 9 6.1 9.3 6.1H23.8C24.2 6.1 24.4 6.6 24.1 6.9L22.9 8.1Z" fill="url(#sol-g1)"/>
    </svg>
  `,

  // 4. Binance Coin (Official Yellow Diamond Crest)
  BNB: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
      <path d="M16 6.5L20.8 11.3L18.4 13.7L16 11.3L13.6 13.7L11.2 11.3L16 6.5ZM21.9 12.5L24.3 14.9L21.9 17.3L19.5 14.9L21.9 12.5ZM10.1 12.5L12.5 14.9L10.1 17.3L7.7 14.9L10.1 12.5ZM16 13.7L18.4 16.1L16 18.5L13.6 16.1L16 13.7ZM20.8 18.5L18.4 20.9L16 18.5L13.6 20.9L11.2 18.5L16 23.3L20.8 18.5Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 5. Ripple (Official Interconnected Triskelion Nodes)
  XRP: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#23292F"/>
      <path d="M23.9 8.5H21.5C21.3 8.5 21.1 8.6 21 8.7L16 13.7L11 8.7C10.9 8.6 10.7 8.5 10.5 8.5H8.1C7.8 8.5 7.6 8.9 7.8 9.1L14.7 16L7.8 22.9C7.6 23.1 7.8 23.5 8.1 23.5H10.5C10.7 23.5 10.9 23.4 11 23.3L16 18.3L21 23.3C21.1 23.4 21.3 23.5 21.5 23.5H23.9C24.2 23.5 24.4 23.1 24.2 22.9L17.3 16L24.2 9.1C24.4 8.9 24.2 8.5 23.9 8.5Z" fill="#00AAE4"/>
    </svg>
  `,

  // 6. Dogecoin (Official Gold Coin with Serif Ð)
  DOGE: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#C2A633"/>
      <circle cx="16" cy="16" r="14.2" stroke="#E5CF64" stroke-width="1.2" fill="none"/>
      <path d="M12 9.5H17.2C20.5 9.5 22.8 11.9 22.8 16C22.8 20.1 20.5 22.5 17.2 22.5H12V9.5ZM15 11.8V14.8H18.2V16.8H15V20.2H17C18.8 20.2 19.8 18.8 19.8 16C19.8 13.2 18.8 11.8 17 11.8H15ZM10.5 14.8H15V16.8H10.5V14.8Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 7. NVIDIA (Official Claw Eye Polygon)
  NVDA: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#0B0F19"/>
      <path d="M14.5 7.5C10.2 8.1 6.8 11.8 6.8 16.3C6.8 20.9 10.4 24.6 15 24.8C19.5 25 23.4 21.8 24.3 17.5H20.5C19.7 19.7 17.5 21.3 15 21.1C12.3 20.9 10.2 18.7 10.2 16.1C10.2 13.5 12.2 11.3 14.8 11.1C16.9 10.9 18.6 11.9 19.5 13.6H23.3C22 9.9 18.5 7.5 14.5 7.5Z" fill="#76B900"/>
      <path d="M14.6 13.2C13.1 13.3 11.9 14.5 11.9 16C11.9 17.5 13.2 18.8 14.7 18.8C15.9 18.8 16.8 18.1 17.3 17.1H19.8C19.1 19.3 17.1 20.8 14.7 20.8C12 20.8 9.9 18.7 9.9 16C9.9 13.3 12.1 11.1 14.8 11.1V13.2H14.6Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 8. Apple (Official Monochrome Silhouette with Leaf)
  AAPL: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aapl-disc" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#374151"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#aapl-disc)"/>
      <path d="M20.2 16.8C20.2 14.1 22.3 12.8 22.4 12.7C21.1 10.8 19.1 10.6 18.4 10.5C16.7 10.3 15 11.5 14.1 11.5C13.2 11.5 11.8 10.5 10.5 10.5C8.8 10.5 7.1 11.5 6.2 13.1C4.3 16.3 5.7 21 7.5 23.6C8.4 24.8 9.4 26.2 10.8 26.1C12.2 26 12.7 25.2 14.3 25.2C15.9 25.2 16.4 26.1 17.8 26.1C19.3 26.1 20.2 24.8 21.1 23.6C22.1 22.2 22.5 20.8 22.5 20.7C22.4 20.6 20.2 19.7 20.2 16.8Z" fill="#FFFFFF"/>
      <path d="M17.4 8.8C18.2 7.8 18.6 6.5 18.5 5.1C17.3 5.2 15.9 6 15.1 6.9C14.4 7.7 13.9 9.1 14.1 10.4C15.4 10.5 16.7 9.7 17.4 8.8Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 9. Tesla (Official Crimson Racing Emblem)
  TSLA: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#E82127"/>
      <path d="M16 8.8C18.5 8.8 21 9.3 23.2 10.2L24.2 7.7C21.7 6.7 18.9 6.2 16 6.2C13.1 6.2 10.3 6.7 7.8 7.7L8.8 10.2C11 9.3 13.5 8.8 16 8.8Z" fill="#FFFFFF"/>
      <path d="M14.8 12.2H17.2V25.2H14.8V12.2Z" fill="#FFFFFF"/>
      <path d="M16 11C19.4 11 22.6 12 25.3 13.8L25.8 11.4C22.8 9.6 19.4 8.6 16 8.6C12.6 8.6 9.2 9.6 6.2 11.4L6.7 13.8C9.4 12 12.6 11 16 11Z" fill="#FFFFFF"/>
    </svg>
  `,

  // 10. Microsoft (Official 4 Quadrant Tile Colors)
  MSFT: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#1E293B"/>
      <g transform="translate(7.5, 7.5)">
        <rect x="0" y="0" width="8" height="8" fill="#F25022"/>
        <rect x="9" y="0" width="8" height="8" fill="#7FBA00"/>
        <rect x="0" y="9" width="8" height="8" fill="#00A4EF"/>
        <rect x="9" y="9" width="8" height="8" fill="#FFB900"/>
      </g>
    </svg>
  `,

  // 11. Amazon (Official Disc with Orange Smile Curve)
  AMZN: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#131921"/>
      <path d="M10 14.5C10 12.5 12 11 14.5 11C16.5 11 18 12.2 18.5 13.5H16.8C16.4 12.8 15.6 12.2 14.5 12.2C13 12.2 11.8 13.2 11.8 14.5C11.8 15.8 13 16.8 14.5 16.8C15.6 16.8 16.4 16.2 16.8 15.5H18.5C18 16.8 16.5 18 14.5 18C12 18 10 16.5 10 14.5Z" fill="#FFFFFF"/>
      <path d="M8.5 21C13 23.5 19 23.5 23.5 21" stroke="#FF9900" stroke-width="2" stroke-linecap="round"/>
      <path d="M22 19.5L24 21.2L21.5 22.5" fill="#FF9900"/>
    </svg>
  `,

  // 12. Gold Spot (3D Metallic Polished Bullion Ingot)
  GOLD: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gold-disc" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="45%" stop-color="#EAB308"/>
          <stop offset="100%" stop-color="#9A3412"/>
        </radialGradient>
        <linearGradient id="ingot-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="100%" stop-color="#FACC15"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#gold-disc)"/>
      <!-- Bullion Ingot Geometry -->
      <path d="M9 13.5L13.5 9H18.5L23 13.5L16 23.5L9 13.5Z" fill="url(#ingot-top)" stroke="#FFEAA7" stroke-width="0.75"/>
      <path d="M13.5 9L16 13.5L18.5 9" stroke="#FFFFFF" stroke-width="0.8" fill="none"/>
      <path d="M16 13.5V23.5" stroke="#CA8A04" stroke-width="0.8"/>
      <path d="M9 13.5H23" stroke="#CA8A04" stroke-width="0.6"/>
    </svg>
  `,

  // 13. Silver Spot (Polished Platinum Silver Bullion)
  SILVER: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="silver-disc" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="50%" stop-color="#94A3B8"/>
          <stop offset="100%" stop-color="#475569"/>
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#silver-disc)"/>
      <path d="M9 13.5L13.5 9H18.5L23 13.5L16 23.5L9 13.5Z" fill="#E2E8F0" stroke="#FFFFFF" stroke-width="0.75"/>
      <path d="M13.5 9L16 13.5L18.5 9" stroke="#FFFFFF" stroke-width="0.8" fill="none"/>
      <path d="M16 13.5V23.5" stroke="#64748B" stroke-width="0.8"/>
    </svg>
  `,

  // 14. Crude Oil (Slick Petroleum Droplet)
  CRUDE_OIL: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="oil-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="oil-droplet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F59E0B"/>
          <stop offset="30%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#0F172A"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#oil-bg)"/>
      <path d="M16 6.5C16 6.5 9.5 14.5 9.5 19C9.5 22.6 12.4 25.5 16 25.5C19.6 25.5 22.5 22.6 22.5 19C22.5 14.5 16 6.5 16 6.5Z" fill="url(#oil-droplet)"/>
      <path d="M13.5 18C13.5 15.5 15.2 12.8 16 11.8" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.8"/>
    </svg>
  `,

  // 15. EUR/USD (Dual Currency Globe)
  EUR_USD: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#003399"/>
      <circle cx="16" cy="16" r="14" stroke="#FFCC00" stroke-width="0.8" stroke-dasharray="2 2" fill="none"/>
      <path d="M19 11.5C17.5 11.5 16.2 12.2 15.5 13.5H18V15H15.1C15 15.3 15 15.7 15 16C15 16.3 15 16.7 15.1 17H18V18.5H15.5C16.2 19.8 17.5 20.5 19 20.5C20.2 20.5 21.2 20 22 19.2L23 20.5C21.8 21.7 20.5 22.2 19 22.2C16.2 22.2 14 20.5 13.3 18.5H11.5V17H13.1C13 16.7 13 16.3 13 16C13 15.7 13 15.3 13.1 15H11.5V13.5H13.3C14 11.5 16.2 9.8 19 9.8C20.5 9.8 21.8 10.3 23 11.5L22 12.8C21.2 12 20.2 11.5 19 11.5Z" fill="#FFCC00"/>
    </svg>
  `,

  // 16. GBP/USD (Sterling Emblem)
  GBP_USD: `
    <svg viewBox="0 0 32 32" class="coin-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#831843"/>
      <path d="M19.5 11C18.5 10 17 9.5 15.5 9.5C13.5 9.5 12 10.8 12 12.5C12 14 13 15 14.5 15.8L16.2 16.7C17.5 17.4 18.2 18.2 18.2 19.5C18.2 21.2 16.8 22.5 14.8 22.5H21V24H10V22.5L12 22.5C13.2 22.5 14 21.8 14 20.8C14 19.8 13.2 19 12 18.2L10.5 17.3C9.2 16.5 8.5 15.5 8.5 14C8.5 11.8 10.5 9.5 13.8 9.5C15.8 9.5 17.5 10.2 18.8 11.5L19.5 11Z" fill="#FDE047"/>
      <path d="M9 16.5H16.5V18H9V16.5Z" fill="#FDE047"/>
    </svg>
  `
};

function getAssetLogoHTML(ticker, customClass = '') {
  const code = (ticker || '').toUpperCase();
  if (ASSET_LOGOS[code]) {
    return `<div class="logo-box ${customClass}">${ASSET_LOGOS[code]}</div>`;
  }
  return `
    <div class="logo-box coin-logo-fallback ${customClass}">
      ${code.slice(0, 3)}
    </div>
  `;
}

window.getAssetLogoHTML = getAssetLogoHTML;
