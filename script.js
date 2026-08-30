
const KEREOS = (() => {
  const COINS = [
    {id:"bitcoin",symbol:"BTC",name:"Bitcoin",emoji:"₿",color:"#f7931a"},
    {id:"ethereum",symbol:"ETH",name:"Ethereum",emoji:"Ξ",color:"#627eea"},
    {id:"solana",symbol:"SOL",name:"Solana",emoji:"S",color:"#14f195"},
    {id:"ripple",symbol:"XRP",name:"XRP",emoji:"X",color:"#f2f2f2"},
    {id:"cardano",symbol:"ADA",name:"Cardano",emoji:"A",color:"#3468d4"},
    {id:"dogecoin",symbol:"DOGE",name:"Dogecoin",emoji:"Ð",color:"#c2a633"},
    {id:"shiba-inu",symbol:"SHIB",name:"Shiba Inu",emoji:"🐕",color:"#f06"},
    {id:"pepe",symbol:"PEPE",name:"Pepe",emoji:"🐸",color:"#54b948"},
    {id:"bonk",symbol:"BONK",name:"Bonk",emoji:"🐶",color:"#f6a623"},
    {id:"floki",symbol:"FLOKI",name:"Floki",emoji:"🐕",color:"#ff9f1c"},
    {id:"dogwifcoin",symbol:"WIF",name:"dogwifhat",emoji:"🧢",color:"#d9a441"},
    {id:"brett",symbol:"BRETT",name:"Brett",emoji:"🐸",color:"#47b55d"}
  ];
  const FALLBACK = {bitcoin:78644.03,ethereum:2462.65,solana:141.06,ripple:1.398,cardano:.2028,dogecoin:.1706,"shiba-inu":.0000167,pepe:.0000078,bonk:.000021,floki:.000081,dogwifcoin:.86,brett:.061};
  const state = JSON.parse(localStorage.getItem("kereos_v9") || "null") || {
    cash:10000, holdings:{}, trades:[], prices:{...FALLBACK}, changes:{},
    selected:"bitcoin", side:"buy", sellPct:100
  };
  function save(){localStorage.setItem("kereos_v9",JSON.stringify(state))}
  function money(n){if(!Number.isFinite(n)) return "$0.00"; return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:n<1?6:2}).format(n)}
  function num(n){return new Intl.NumberFormat("en-US",{maximumFractionDigits:8}).format(n)}
  function coin(id){return COINS.find(c=>c.id===id)||COINS[0]}
  function logoHTML(c){return `<div class="coin-logo" style="box-shadow:inset 0 0 20px ${c.color}22">${c.emoji}</div>`}
  function getPrice(id){return Number(state.prices[id] ?? FALLBACK[id] ?? 0)}
  function totalPositions(){return Object.entries(state.holdings).reduce((s,[id,q])=>s+q*getPrice(id),0)}
  function totalValue(){return state.cash+totalPositions()}
  function invested(){return state.trades.filter(t=>t.side==="buy").reduce((s,t)=>s+t.amount,0)}
  function pnl(){return totalValue()-10000}
  function toast(msg,ok=true){const el=document.querySelector("#toast");if(!el)return;el.innerHTML=`<b>${ok?"✓":"!"}</b> ${msg}`;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)}
  function seedSeries(id,n=80){let p=getPrice(id)||100;const a=[];for(let i=0;i<n;i++){p*=1+(Math.sin(i*.55+id.length)*.004)+(Math.random()-.48)*.018;a.push(Math.max(p,0.0000001))}return a}
  function drawChart(canvas,series,markers=[]){if(!canvas)return;const dpr=devicePixelRatio||1,w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,w,h);ctx.strokeStyle="rgba(255,255,255,.08)";ctx.lineWidth=1;for(let i=1;i<5;i++){const y=i*h/5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    const min=Math.min(...series),max=Math.max(...series),range=max-min||1;const pts=series.map((v,i)=>[i*(w-20)/(series.length-1)+10,h-20-((v-min)/range)*(h-45)]);
    const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,"#8b5cf6");g.addColorStop(.5,"#c084fc");g.addColorStop(1,"#4de8ff");
    ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=g;ctx.lineWidth=2.5;ctx.shadowBlur=16;ctx.shadowColor="#8b5cf6";ctx.stroke();ctx.shadowBlur=0;
    const fill=ctx.createLinearGradient(0,0,0,h);fill.addColorStop(0,"rgba(139,92,246,.24)");fill.addColorStop(1,"rgba(139,92,246,0)");ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fillStyle=fill;ctx.fill();
    markers.forEach(m=>{const idx=Math.min(series.length-1,Math.max(0,m.index));const [x,y]=pts[idx];ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=m.side==="buy"?"#31e981":"#ff4d6d";ctx.shadowBlur=14;ctx.shadowColor=ctx.fillStyle;ctx.fill();ctx.shadowBlur=0;ctx.fillStyle="white";ctx.font="10px system-ui";ctx.fillText(m.side==="buy"?"BUY":"SELL",x+8,y-8)})
  }
  function bindCommon(){document.querySelector(".mobile-menu")?.addEventListener("click",()=>document.querySelector(".sidebar").classList.toggle("open"));document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".sidebar")?.classList.remove("open")))}
  async function fetchPrices(){try{const ids=COINS.map(c=>c.id).join(",");const r=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,{cache:"no-store"});if(!r.ok)throw 0;const d=await r.json();COINS.forEach(c=>{if(d[c.id]?.usd)state.prices[c.id]=d[c.id].usd;if(d[c.id]?.usd_24h_change!=null)state.changes[c.id]=d[c.id].usd_24h_change});save();document.dispatchEvent(new CustomEvent("pricesUpdated"));}catch(e){document.dispatchEvent(new CustomEvent("pricesUpdated"))}}
  function execute(side,id,qty){const p=getPrice(id);qty=Number(qty);if(!qty||qty<=0)return toast("Enter a valid quantity",false);
    const amount=qty*p;if(side==="buy"){if(amount>state.cash+1e-8)return toast("Not enough cash",false);state.cash-=amount;state.holdings[id]=(state.holdings[id]||0)+qty}
    else {const owned=state.holdings[id]||0;if(qty>owned+1e-10)return toast("You don't own enough "+coin(id).symbol,false);state.cash+=amount;state.holdings[id]=owned-qty;if(state.holdings[id]<1e-10)delete state.holdings[id]}
    state.trades.unshift({time:new Date().toISOString(),side,id,qty,price:p,amount});state.trades=state.trades.slice(0,100);save();toast(`${side==="buy"?"Bought":"Sold"} ${num(qty)} ${coin(id).symbol} at ${money(p)}`);document.dispatchEvent(new CustomEvent("tradeExecuted",{detail:{side,id,qty,price:p}}))
  }
  function setupTrade(){const id=new URLSearchParams(location.search).get("coin")||state.selected;state.selected=id;const c=coin(id);document.querySelectorAll("[data-coin-name]").forEach(x=>x.textContent=c.name);document.querySelectorAll("[data-coin-symbol]").forEach(x=>x.textContent=c.symbol);document.querySelectorAll("[data-coin-logo]").forEach(x=>x.innerHTML=logoHTML(c));
    const priceEl=document.querySelector("[data-trade-price]");if(priceEl)priceEl.textContent=money(getPrice(id));const ch=state.changes[id]??0;const ce=document.querySelector("[data-trade-change]");if(ce){ce.textContent=`${ch>=0?"+":""}${ch.toFixed(2)}% 24h`;ce.className="change "+(ch>=0?"up":"down")}
    const canvas=document.querySelector("#tradeChart");let series=seedSeries(id);let markers=[];state.trades.filter(t=>t.id===id).slice(0,10).reverse().forEach((t,i)=>markers.push({index:Math.floor((i+1)*series.length/(state.trades.filter(x=>x.id===id).length+1)),side:t.side}));drawChart(canvas,series,markers);
    document.querySelectorAll("[data-side]").forEach(b=>b.addEventListener("click",()=>{state.side=b.dataset.side;document.querySelectorAll("[data-side]").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelector("#orderAction").classList.toggle("sell",state.side==="sell");updateOrder()}));
    document.querySelectorAll(".percent").forEach(b=>b.addEventListener("click",()=>{state.sellPct=Number(b.dataset.pct);document.querySelectorAll(".percent").forEach(x=>x.classList.toggle("active",x===b));updateOrder()}));
    document.querySelector("#qty")?.addEventListener("input",updateOrder);document.querySelector("#orderAction")?.addEventListener("click",()=>{const owned=state.holdings[id]||0;let qty=Number(document.querySelector("#qty").value);if(state.side==="sell" && state.sellPct)qty=owned*state.sellPct/100;execute(state.side,id,qty);renderPortfolioMini()});updateOrder();
  }
  function updateOrder(){const id=state.selected,p=getPrice(id),owned=state.holdings[id]||0;const q=document.querySelector("#qty");if(state.side==="sell"){q.value=owned*state.sellPct/100||"";q.max=owned}else if(!q.value)q.value="";const qty=Number(q?.value)||0;const amt=qty*p;document.querySelector("#orderAmount")&&(document.querySelector("#orderAmount").textContent=money(amt));document.querySelector("#ownedAmount")&&(document.querySelector("#ownedAmount").textContent=num(owned)+" "+coin(id).symbol)}
  function renderMarkets(){const wrap=document.querySelector("#marketGrid");if(!wrap)return;const q=(document.querySelector("#marketSearch")?.value||"").toLowerCase();const filter=document.querySelector(".tab.active")?.dataset.filter||"all";const meme=["dogecoin","shiba-inu","pepe","bonk","floki","dogwifcoin","brett"];const list=COINS.filter(c=>(!q||c.name.toLowerCase().includes(q)||c.symbol.toLowerCase().includes(q))&&(filter==="all"||(filter==="meme"&&meme.includes(c.id))||(filter==="major"&&!meme.includes(c.id))));wrap.innerHTML=list.map(c=>{const ch=state.changes[c.id]??((Math.random()*8)-4);return `<article class="market-card reveal"><div class="coin-row"><div class="coin">${logoHTML(c)}<div><b>${c.name}</b><div class="symbol">${c.symbol} · CRYPTO</div></div></div><span class="pill ${ch>=0?"up":"down"}">${ch>=0?"▲":"▼"} ${Math.abs(ch).toFixed(2)}%</span></div><div class="price">${money(getPrice(c.id))}</div><div class="change ${ch>=0?"up":"down"}">${ch>=0?"+":""}${ch.toFixed(2)}% 24h</div><canvas class="spark" data-spark="${c.id}"></canvas><div class="trade-row"><a class="btn primary" href="trade.html?coin=${c.id}">Trade ${c.symbol}</a><button class="btn quick-buy" data-id="${c.id}">Quick Buy</button></div></article>`}).join("");
    wrap.querySelectorAll(".spark").forEach(cv=>drawChart(cv,seedSeries(cv.dataset.spark,38)));wrap.querySelectorAll(".quick-buy").forEach(b=>b.onclick=()=>execute("buy",b.dataset.id,.001));
  }
  function renderPortfolio(){const cash=document.querySelector("#cash");if(cash)cash.textContent=money(state.cash);const tv=document.querySelector("#totalValue");if(tv)tv.textContent=money(totalValue());const inv=document.querySelector("#invested");if(inv)inv.textContent=money(invested());const pp=document.querySelector("#pnl");if(pp){pp.textContent=(pnl()>=0?"+":"")+money(pnl());pp.className=pnl()>=0?"up":"down"}
    const body=document.querySelector("#holdingsBody");if(body){const rows=Object.entries(state.holdings).map(([id,q])=>{const c=coin(id),p=getPrice(id),cost=state.trades.filter(t=>t.id===id&&t.side==="buy").reduce((s,t)=>s+t.amount,0),v=q*p;return `<tr><td><div class="asset-cell">${logoHTML(c)}<div><b>${c.name}</b><div class="symbol">${c.symbol}</div></div></div></td><td>${num(q)}</td><td>${money(cost/(q||1))}</td><td>${money(p)}</td><td>${money(v)}</td><td class="${v-cost>=0?"up":"down"}">${v-cost>=0?"+":""}${money(v-cost)}</td><td><a class="btn" href="trade.html?coin=${id}&side=sell">Sell</a></td></tr>`});body.innerHTML=rows.join("")||`<tr><td colspan="7" style="text-align:center;padding:35px" class="muted">No positions yet. Visit Markets and make your first trade.</td></tr>`}
    const act=document.querySelector("#activity");if(act)act.innerHTML=state.trades.slice(0,8).map(t=>`<div class="activity-row"><div><b class="${t.side==="buy"?"up":"down"}">${t.side.toUpperCase()}</b> ${coin(t.id).symbol}<div class="symbol">${new Date(t.time).toLocaleString()}</div></div><b>${num(t.qty)} · ${money(t.amount)}</b></div>`).join("")||`<div class="muted">Your executed trades will appear here.</div>`;
    const cv=document.querySelector("#portfolioChart");if(cv){const base=10000,series=Array.from({length:70},(_,i)=>base+(pnl()*i/69)+Math.sin(i*.35)*25);drawChart(cv,series)}
  }
  function renderPortfolioMini(){renderPortfolio()}
  function renderDashboard(){renderPortfolio();const popular=document.querySelector("#popular");if(popular)popular.innerHTML=COINS.slice(0,6).map(c=>`<a class="activity-row" href="trade.html?coin=${c.id}"><div class="asset-cell">${logoHTML(c)}<b>${c.symbol}</b></div><b>${money(getPrice(c.id))}</b></a>`).join("")}
  function renderChallenges(){const body=document.querySelector("#challengeGrid");if(!body)return;const volume=state.trades.reduce((s,t)=>s+t.amount,0);const done=Math.min(100,volume/1000*100);body.innerHTML=[["First Flight","Make your first trade","$0 / $100","Start trading"],["Momentum","Reach $1,000 in volume",money(volume)+" / $1,000",Math.round(Math.min(100,volume/10))+"%"],["Diamond Hands","Hold an asset for 24 hours","In progress","LIVE"],["Meme Lord","Trade a meme coin","DOGE · PEPE · SHIB","Explore"],["Diversifier","Own 3 different assets",Object.keys(state.holdings).length+" / 3",Math.min(100,Object.keys(state.holdings).length/3*100).toFixed(0)+"%"],["Market Maker","Complete 10 trades",state.trades.length+" / 10",Math.min(100,state.trades.length*10)+"%"]].map(x=>`<article class="challenge reveal"><span class="badge">${x[3]}</span><h3>${x[0]}</h3><div class="muted">${x[1]}</div><div style="margin:16px 0">${x[2]}</div><div class="progress"><i style="width:${typeof x[3]==="string"&&x[3].endsWith("%")?x[3]:"42%"}"></i></div></article>`).join("")}
  function init(){bindCommon();if(document.querySelector("#marketGrid")){renderMarkets();document.querySelector("#marketSearch")?.addEventListener("input",renderMarkets);document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");renderMarkets()})}if(document.querySelector("#tradeChart"))setupTrade();if(document.querySelector("#holdingsBody"))renderPortfolio();if(document.querySelector("#popular"))renderDashboard();if(document.querySelector("#challengeGrid"))renderChallenges();document.addEventListener("pricesUpdated",()=>{if(document.querySelector("#marketGrid"))renderMarkets();if(document.querySelector("#tradeChart"))setupTrade();if(document.querySelector("#holdingsBody"))renderPortfolio();if(document.querySelector("#popular"))renderDashboard()});fetchPrices();setInterval(fetchPrices,30000)}
  return {init,state,execute};
})();document.addEventListener("DOMContentLoaded",KEREOS.init);
