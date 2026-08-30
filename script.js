
const ASSETS=[
{symbol:"BTC",name:"Bitcoin",pair:"BTCUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/1/large/bitcoin.png",seed:108000},
{symbol:"ETH",name:"Ethereum",pair:"ETHUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/279/large/ethereum.png",seed:4400},
{symbol:"BNB",name:"BNB",pair:"BNBUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",seed:850},
{symbol:"SOL",name:"Solana",pair:"SOLUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/4128/large/solana.png",seed:205},
{symbol:"XRP",name:"XRP",pair:"XRPUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",seed:2.8},
{symbol:"ADA",name:"Cardano",pair:"ADAUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/975/large/cardano.png",seed:.82},
{symbol:"AVAX",name:"Avalanche",pair:"AVAXUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",seed:25},
{symbol:"LINK",name:"Chainlink",pair:"LINKUSDT",type:"crypto",icon:"https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",seed:25},
{symbol:"DOGE",name:"Dogecoin",pair:"DOGEUSDT",type:"meme",icon:"https://assets.coingecko.com/coins/images/5/large/dogecoin.png",seed:.23},
{symbol:"SHIB",name:"Shiba Inu",pair:"SHIBUSDT",type:"meme",icon:"https://assets.coingecko.com/coins/images/11939/large/shiba.png",seed:.000014},
{symbol:"PEPE",name:"Pepe",pair:"PEPEUSDT",type:"meme",icon:"https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg",seed:.000009},
{symbol:"BONK",name:"Bonk",pair:"BONKUSDT",type:"meme",icon:"https://assets.coingecko.com/coins/images/28600/large/bonk.jpg",seed:.000035},
{symbol:"WIF",name:"dogwifhat",pair:"WIFUSDT",type:"meme",icon:"https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg",seed:1.2}
];

let db=JSON.parse(localStorage.getItem("kereos_v5")||"null")||{
 cash:10000,positions:{},trades:[],challenge:null,watchlist:["BTC","ETH","SOL","PEPE"]
};
let quotes={},selected=new URLSearchParams(location.search).get("coin")||"BTC",side="buy",chartData=[],chartInterval="5m",accountMode="main";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const asset=s=>ASSETS.find(a=>a.symbol===s)||ASSETS[0];
const val=s=>quotes[s]?.price??asset(s).seed;
const money=n=>"$"+Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
function formatPrice(n){if(!n)return"—";if(n<.000001)return"$"+n.toFixed(10);if(n<.001)return"$"+n.toFixed(7);if(n<1)return"$"+n.toFixed(4);if(n<10)return"$"+n.toFixed(3);return money(n)}
function save(){localStorage.setItem("kereos_v5",JSON.stringify(db))}
function mainEquity(){return db.cash+Object.entries(db.positions).reduce((sum,[s,p])=>sum+p.qty*val(s),0)}
function challengeEquity(){return db.challenge?db.challenge.cash+Object.entries(db.challenge.positions||{}).reduce((sum,[s,p])=>sum+p.qty*val(s),0):0}
function toast(text){let t=$(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=text;t.style.opacity="1";clearTimeout(window.tt);window.tt=setTimeout(()=>t.style.opacity="0",2600)}
function icon(a){return `<div class="coinicon"><img src="${a.icon}" onerror="this.style.display='none'"></div>`}
function nav(){const p=document.body.dataset.page;$$(".nav a").forEach(a=>a.classList.toggle("active",a.dataset.page===p))}
function card(a){
 const q=quotes[a.symbol]||{},ch=q.change||0;
 return `<div class="card coin" onclick="selectCoin('${a.symbol}')">
   <div class="coinhead">${icon(a)}<span class="pill ${ch<0?"red":""}">${ch>=0?"▲":"▼"} ${Math.abs(ch).toFixed(2)}%</span></div>
   <div class="coinname">${a.name}</div><div class="symbol">${a.symbol} · ${a.type==="meme"?"MEME":"CRYPTO"}</div>
   <div class="price">${formatPrice(val(a.symbol))}</div>
   <div class="change ${ch>=0?"positive":"negative"}">${ch>=0?"+":""}${ch.toFixed(2)}% 24h</div>
   <div class="muted" style="margin-top:8px">Vol ${q.volume?money(q.volume):"live feed"}</div>
   <button class="btn purple" style="width:100%;margin-top:11px" onclick="event.stopPropagation();selectCoin('${a.symbol}')">Trade ${a.symbol}</button>
 </div>`
}
async function fetchJSON(url){
 const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);return r.json()
}
async function updateQuotes(){
 let ok=0;
 try{
  const data=await fetchJSON("https://api.binance.com/api/v3/ticker/24hr");
  const wanted=new Set(ASSETS.map(a=>a.pair));
  data.filter(x=>wanted.has(x.symbol)).forEach(x=>quotes[ASSETS.find(a=>a.pair===x.symbol).symbol]={price:+x.lastPrice,change:+x.priceChangePercent,high:+x.highPrice,low:+x.lowPrice,volume:+x.quoteVolume});
  ok=Object.keys(quotes).length;
 }catch(e){}
 if(ok<ASSETS.length){
  try{
   const ids=["bitcoin","ethereum","binancecoin","solana","ripple","cardano","avalanche-2","chainlink","dogecoin","shiba-inu","pepe","bonk","dogwifcoin"].join(",");
   const d=await fetchJSON("https://api.coingecko.com/api/v3/simple/price?ids="+ids+"&vs_currencies=usd&include_24hr_change=true");
   const map={BTC:"bitcoin",ETH:"ethereum",BNB:"binancecoin",SOL:"solana",XRP:"ripple",ADA:"cardano",AVAX:"avalanche-2",LINK:"chainlink",DOGE:"dogecoin",SHIB:"shiba-inu",PEPE:"pepe",BONK:"bonk",WIF:"dogwifcoin"};
   Object.entries(map).forEach(([s,id])=>{if(d[id])quotes[s]={...(quotes[s]||{}),price:d[id].usd,change:d[id].usd_24h_change||0}});
   ok=Object.keys(quotes).length;
  }catch(e){}
 }
 $("#liveState")?.replaceChildren(document.createTextNode(ok?"● LIVE MARKET DATA":"● FALLBACK PRICES"));
 render();
 if(document.body.dataset.page==="markets")loadCandles();
}
function render(){
 common();
 const p=document.body.dataset.page;
 if(p==="home")renderHome();
 if(p==="markets")renderMarkets();
 if(p==="portfolio")renderPortfolio();
 if(p==="challenges")renderChallenges();
}
function common(){
 $$("[data-add]").forEach(b=>b.onclick=openFund);
 $$("[data-close]").forEach(b=>b.onclick=()=>$("#fundModal")?.classList.remove("open"));
 const form=$("#fundForm");if(form&&!form.dataset.ready){form.dataset.ready="1";form.onsubmit=e=>{e.preventDefault();const n=+form.amount.value;if(n>0){db.cash+=n;save();$("#fundModal").classList.remove("open");toast("Added "+money(n)+" demo balance");render()}}}
}
function openFund(){$("#fundModal")?.classList.add("open")}
function renderHome(){
 const eq=mainEquity(),pl=eq-10000;
 $("#homeEquity")&&(homeEquity.textContent=money(eq));$("#homePnl")&&(homePnl.textContent=(pl>=0?"+":"")+money(pl)+" overall");
 $("#homeCoins")&&(homeCoins.innerHTML=ASSETS.slice(0,8).map(card).join(""));
 $("#homePositions")&&(homePositions.innerHTML=positionsHTML(db.positions));
 $("#homeTrades")&&(homeTrades.innerHTML=tradesHTML());
 drawHero();
}
function drawHero(){
 const c=$("#heroChart");if(!c)return;const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;
 const x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);const w=r.width,h=r.height;x.clearRect(0,0,w,h);x.strokeStyle="rgba(181,140,255,.8)";x.lineWidth=2;x.beginPath();
 for(let i=0;i<80;i++){let xx=i*w/79,yy=h*.66-Math.sin(i/7)*13-i*.5+(Math.random()-.5)*3;i?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke();
}
function positionsHTML(pos){
 const keys=Object.keys(pos||{});if(!keys.length)return`<div class="empty">No positions yet. Trade an asset in Markets.</div>`;
 return `<div class="table"><div class="thead"><span>Asset</span><span>Amount</span><span>Value</span><span>P&L</span></div>${keys.map(s=>{const p=pos[s],pl=(val(s)-p.avg)*p.qty;return`<div class="trow"><b>${s}</b><span>${p.qty.toFixed(6)}</span><span>${money(p.qty*val(s))}</span><span class="${pl>=0?"positive":"negative"}">${pl>=0?"+":""}${money(pl)}</span></div>`}).join("")}</div>`
}
function tradesHTML(){
 if(!db.trades.length)return`<div class="empty">No trades yet. Your activity will appear here.</div>`;
 return `<div class="table"><div class="thead"><span>Side</span><span>Asset</span><span>Total</span><span>P&L</span></div>${db.trades.slice(0,15).map(t=>`<div class="trow"><b class="${t.side==="BUY"?"positive":"negative"}">${t.side}</b><span>${t.symbol}</span><span>${money(t.total)}</span><span class="${(t.pnl||0)>=0?"positive":"negative"}">${t.side==="SELL"?(t.pnl>=0?"+":"")+money(t.pnl):"—"}</span></div>`).join("")}</div>`
}
function renderMarkets(){
 if(!$("#marketList"))return;
 const filter=$(".tab.active")?.dataset.filter||"all",q=($("#search")?.value||"").toLowerCase();
 const arr=ASSETS.filter(a=>(filter==="all"||a.type===filter)&&(a.name.toLowerCase().includes(q)||a.symbol.toLowerCase().includes(q)));
 marketList.innerHTML=arr.map(card).join("")||`<div class="card empty">No assets found.</div>`;
 memeGrid.innerHTML=ASSETS.filter(a=>a.type==="meme").map(card).join("");
 renderTrade();drawMiniCharts();
}
function drawMiniCharts(){
 $$(".mini").forEach((c,i)=>{const a=ASSETS[i],r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;const x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);const w=r.width,h=r.height,ch=quotes[a?.symbol]?.change||0;x.strokeStyle=ch>=0?"#35e88a":"#ff5577";x.lineWidth=1.5;x.beginPath();for(let j=0;j<30;j++){const xx=j*w/29,yy=h*.55-(j/29*ch*.2)-Math.sin(j/3)*2;j?x.lineTo(xx,yy):x.moveTo(xx,yy)}x.stroke()})
}
function selectCoin(s){selected=s;history.replaceState(null,"","markets.html?coin="+s);renderMarkets();loadCandles()}
async function loadCandles(){
 const a=asset(selected),c=$("#priceChart");if(!c)return;
 try{
  const k=await fetchJSON(`https://api.binance.com/api/v3/klines?symbol=${a.pair}&interval=${chartInterval}&limit=100`);
  chartData=k.map(v=>({t:+v[0],o:+v[1],h:+v[2],l:+v[3],c:+v[4]}));
 }catch(e){
  let p=val(selected);chartData=Array.from({length:100},(_,i)=>{const o=p*(1+(Math.random()-.5)*.04),cl=o*(1+(Math.random()-.5)*.01);return{t:i,o,h:Math.max(o,cl)*1.004,l:Math.min(o,cl)*.996,c:cl}});chartData[99].c=p;
 }
 drawChart()
}
function renderTrade(){
 const a=asset(selected),q=quotes[selected]||{},p=val(selected);
 if(!$("#tradeName"))return;
 tradeIcon.innerHTML=`<img src="${a.icon}" onerror="this.style.display='none'">`;tradeName.textContent=a.name;tradeSymbol.textContent=a.symbol+" / USD";tradePrice.textContent=formatPrice(p);
 tradeChange.textContent=(q.change>=0?"+":"")+(q.change||0).toFixed(2)+"%";tradeChange.className="pill "+(q.change<0?"red":"");
 updateOrder();
}
function drawChart(){
 const c=$("#priceChart");if(!c||!chartData.length)return;const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;
 const x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);const w=r.width,h=r.height;x.clearRect(0,0,w,h);
 x.strokeStyle="rgba(255,255,255,.045)";for(let i=1;i<6;i++){x.beginPath();x.moveTo(0,i*h/6);x.lineTo(w,i*h/6);x.stroke()}for(let i=1;i<9;i++){x.beginPath();x.moveTo(i*w/9,0);x.lineTo(i*w/9,h);x.stroke()}
 const lo=Math.min(...chartData.map(v=>v.l)),hi=Math.max(...chartData.map(v=>v.h)),range=hi-lo||1;
 const y=v=>h-28-(v-lo)/range*(h-55),gap=w/chartData.length,body=Math.max(2,gap*.55);
 chartData.forEach((v,i)=>{const cx=i*gap+gap/2,up=v.c>=v.o;x.strokeStyle=up?"#35e88a":"#ff5577";x.fillStyle=up?"#35e88a":"#ff5577";x.beginPath();x.moveTo(cx,y(v.h));x.lineTo(cx,y(v.l));x.stroke();const top=y(Math.max(v.o,v.c)),bot=y(Math.min(v.o,v.c));x.fillRect(cx-body/2,top,body,Math.max(2,bot-top))});
 db.trades.filter(t=>t.symbol===selected).slice(0,12).forEach((t,i)=>{const idx=Math.max(0,chartData.length-1-i*7),v=chartData[idx],cx=idx*gap+gap/2,cy=y(v.c);x.fillStyle=t.side==="BUY"?"#35e88a":"#ff5577";x.beginPath();x.arc(cx,cy,5,0,Math.PI*2);x.fill()});
}
function updateOrder(){
 if(!$("#qty"))return;const q=+qty.value||0;orderTotal.textContent=money(q*val(selected));
 if(accountMode==="challenge"&&db.challenge){available.textContent=money(db.challenge.cash)}else available.textContent=money(db.cash);
}
function executeTrade(){
 const q=+qty.value||0,p=val(selected),total=q*p;if(!q||!p)return toast("Enter a quantity");
 const acc=accountMode==="challenge"&&db.challenge?db.challenge:null;
 if(acc){
  acc.positions=acc.positions||{};
  if(side==="buy"){if(total>acc.cash)return toast("Challenge balance is too low");acc.cash-=total;let z=acc.positions[selected]||{qty:0,avg:p};z.avg=(z.avg*z.qty+total)/(z.qty+q);z.qty+=q;acc.positions[selected]=z}
  else{const z=acc.positions[selected];if(!z||z.qty<q)return toast("Challenge has no position to sell");acc.cash+=total;z.qty-=q;if(z.qty<1e-10)delete acc.positions[selected]}
  acc.current=challengeEquity();checkChallenge();
 }else{
  if(side==="buy"){if(total>db.cash)return toast("Not enough demo balance");db.cash-=total;let z=db.positions[selected]||{qty:0,avg:p};z.avg=(z.avg*z.qty+total)/(z.qty+q);z.qty+=q;db.positions[selected]=z;db.trades.unshift({side:"BUY",symbol:selected,total,pnl:0})}
  else{const z=db.positions[selected];if(!z||z.qty<q)return toast("You don't own enough "+selected);const pnl=(p-z.avg)*q;db.cash+=total;z.qty-=q;if(z.qty<1e-10)delete db.positions[selected];db.trades.unshift({side:"SELL",symbol:selected,total,pnl})}
 }
 save();toast((side==="buy"?"🟢 Bought ":"🔴 Sold ")+q+" "+selected);render();loadCandles()
}
function checkChallenge(){
 const c=db.challenge;if(!c?.active)return;
 const now=Date.now(),pct=(challengeEquity()-c.start)/c.start;
 if(challengeEquity()>=c.target){c.active=false;c.result="won";toast("🏆 Challenge completed!");}
 else if(now>=c.ends){c.active=false;c.result="lost";toast("Challenge expired — try again.");}
}
function renderPortfolio(){
 portfolioTotal.textContent=money(mainEquity());portfolioCash.textContent=money(db.cash);positions.innerHTML=positionsHTML(db.positions);transactions.innerHTML=tradesHTML();
}
const CH=[
["Double Up","🥇","easy",100,200,24*3600000,"Turn $100 into $200."],
["Five Hundred","⚡","medium",500,1000,3*86400000,"Turn $500 into $1,000."],
["Big League","👑","hard",1000,2500,7*86400000,"Turn $1,000 into $2,500."],
["Absolute Degenerate","🤪","insane",2000,5000,7*86400000,"Turn $2,000 into $5,000."]
];
function startChallenge(i){
 if(db.challenge?.active)return toast("Finish your current challenge first");
 const c=CH[i];db.challenge={active:true,name:c[0],start:c[3],current:c[3],target:c[4],cash:c[3],positions:{},ends:Date.now()+c[5],result:null};save();toast("🚀 "+c[0]+" started");render()
}
function renderChallenges(){
 challengeCards.innerHTML=CH.map((c,i)=>`<div class="card challenge"><div class="difficulty ${c[2]}">${c[2].toUpperCase()}</div><div class="challengeicon">${c[1]}</div><h3>${c[0]}</h3><p>${c[6]}</p><div class="meta"><span>⏱ ${i===0?"24 hours":i===1?"3 days":"7 days"}</span><span>${money(c[3])} → ${money(c[4])}</span></div><button class="btn purple" style="width:100%;margin-top:15px" onclick="startChallenge(${i})">Start challenge</button></div>`).join("");
 const c=db.challenge;
 if(c?.active){const eq=challengeEquity(),pct=Math.min(100,eq/c.target*100),left=Math.max(0,c.ends-Date.now());challengeStatus.innerHTML=`<div class="card"><div class="eyebrow">ACTIVE CHALLENGE</div><h2>${c.name}</h2><div style="display:flex;justify-content:space-between;margin:15px 0 8px"><span class="muted">Progress</span><b>${money(eq)} / ${money(c.target)}</b></div><div class="progress"><div style="width:${pct}%"></div></div><div class="meta"><span>${money(eq-c.start)} P&L</span><span id="challengeTimer">${timeLeft(left)}</span></div><button class="btn red" style="margin-top:14px" onclick="forfeitChallenge()">Forfeit</button><button class="btn purple" style="margin-top:14px;margin-left:6px" onclick="location.href='markets.html'">Trade challenge</button></div>`}
 else challengeStatus.innerHTML=`<div class="card empty">${c?.result==="won"?"🏆 You completed your last challenge!":c?.result==="lost"?"💀 Last challenge failed. Try another.":"No active challenge. Start one below."}</div>`;
}
function timeLeft(ms){let s=Math.floor(ms/1000),d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);return d?`${d}d ${h}h`:h?`${h}h ${m}m`:`${m}m`}
function forfeitChallenge(){if(db.challenge){db.challenge.active=false;db.challenge.result="lost";save();toast("Challenge forfeited");render()}}
function init(){
 nav();render();
 $$(".toggle button").forEach(b=>b.onclick=()=>{side=b.dataset.side;$$(".toggle button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
 $("#execute")?.addEventListener("click",executeTrade);$("#qty")?.addEventListener("input",updateOrder);
 $$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");renderMarkets()});
 $("#search")?.addEventListener("input",renderMarkets);
 $("#accountMode")?.addEventListener("change",e=>{accountMode=e.target.value;updateOrder()});
 $$(".charttools button")?.forEach(b=>b.onclick=()=>{$$(".charttools button").forEach(x=>x.classList.remove("active"));b.classList.add("active");chartInterval=b.dataset.interval;loadCandles()});
 updateQuotes();setInterval(updateQuotes,30000);
 setInterval(()=>{checkChallenge();if(document.body.dataset.page==="markets"){drawChart();updateOrder()}if(document.body.dataset.page==="challenges"){renderChallenges()}},1000);
 window.addEventListener("resize",()=>{drawHero();drawMiniCharts();drawChart()});
}
window.selectCoin=selectCoin;window.startChallenge=startChallenge;window.forfeitChallenge=forfeitChallenge;
document.addEventListener("DOMContentLoaded",init);
