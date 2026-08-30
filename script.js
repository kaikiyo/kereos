
const API='https://api.coingecko.com/api/v3/simple/price';
const COINS={
 BTC:{id:'bitcoin',name:'Bitcoin',symbol:'BTC',class:'btc',emoji:'₿',fallback:78644.03},
 ETH:{id:'ethereum',name:'Ethereum',symbol:'ETH',class:'eth',emoji:'Ξ',fallback:2462.65},
 SOL:{id:'solana',name:'Solana',symbol:'SOL',class:'sol',emoji:'S',fallback:188.40},
 XRP:{id:'ripple',name:'XRP',symbol:'XRP',class:'xrp',emoji:'X',fallback:1.398},
 ADA:{id:'cardano',name:'Cardano',symbol:'ADA',class:'',emoji:'A',fallback:.2028},
 DOGE:{id:'dogecoin',name:'Dogecoin',symbol:'DOGE',class:'doge',emoji:'Ð',fallback:.213},
 SHIB:{id:'shiba-inu',name:'Shiba Inu',symbol:'SHIB',class:'',emoji:'S',fallback:.0000124},
 PEPE:{id:'pepe',name:'Pepe',symbol:'PEPE',class:'pepe',emoji:'🐸',fallback:.0000091}
};
let prices={}; let demo=JSON.parse(localStorage.getItem('kereosDemo')||'null');
if(!demo) demo={cash:10000,positions:{},orders:[],started:Date.now(),challenge:null};
function save(){localStorage.setItem('kereosDemo',JSON.stringify(demo))}
function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:n<1?6:2}).format(n||0)}
function getPrice(s){return prices[s]??COINS[s]?.fallback??0}
function navActive(){let p=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===p))}
async function loadPrices(){
 const ids=Object.values(COINS).map(x=>x.id).join(',');
 try{
   const r=await fetch(`${API}?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,{cache:'no-store'});
   if(!r.ok) throw 0; const d=await r.json();
   Object.entries(COINS).forEach(([s,c])=>{prices[s]=d[c.id]?.usd??c.fallback;c.change=d[c.id]?.usd_24h_change??0;c.vol=d[c.id]?.usd_24h_vol??0})
 }catch(e){Object.entries(COINS).forEach(([s,c])=>{prices[s]=c.fallback;c.change=(Math.random()*4-1.5);c.vol=0})}
 renderPage();
}
function portfolioValue(){let v=demo.cash;Object.entries(demo.positions).forEach(([s,p])=>v+=p.qty*getPrice(s));return v}
function invested(){return Object.values(demo.positions).reduce((a,p)=>a+p.cost,0)}
function pnl(){return Object.entries(demo.positions).reduce((a,[s,p])=>a+p.qty*getPrice(s)-p.cost,0)}
function renderCommon(){
 navActive();
 const cash=document.querySelectorAll('[data-cash]');cash.forEach(x=>x.textContent=money(demo.cash));
 const total=document.querySelectorAll('[data-total]');total.forEach(x=>x.textContent=money(portfolioValue()));
 const p=document.querySelectorAll('[data-pnl]');p.forEach(x=>{x.textContent=(pnl()>=0?'+':'')+money(pnl());x.className='value '+(pnl()>=0?'green':'red')});
}
function renderMarkets(){
 const grid=document.getElementById('coinGrid');if(!grid)return;
 const q=(document.getElementById('search')?.value||'').toLowerCase();
 const tab=document.querySelector('.tab.active')?.dataset.tab||'all';
 grid.innerHTML=Object.entries(COINS).filter(([s,c])=>(!q||(s+c.name).toLowerCase().includes(q))).filter(([s])=>tab==='all'||(tab==='meme'?['DOGE','SHIB','PEPE'].includes(s):!['DOGE','SHIB','PEPE'].includes(s))).map(([s,c])=>`
 <div class="card coin-card"><div class="coin-top"><div class="asset"><div class="coin ${c.class}">${c.emoji}</div><div><b>${c.name}</b><div class="muted">${s} · CRYPTO</div></div></div><span class="tag">${c.change>=0?'▲':'▼'} ${Math.abs(c.change||0).toFixed(2)}%</span></div>
 <div class="price">${money(getPrice(s))}</div><div class="change ${c.change>=0?'green':'red'}">${c.change>=0?'+':''}${(c.change||0).toFixed(2)}% 24h</div><div class="muted" style="font-size:11px;margin-top:8px">Vol ${c.vol?money(c.vol):'live feed'}</div>
 <div class="coin-actions"><button class="btn buy" onclick="openTrade('${s}','buy')">Buy ${s}</button><button class="btn sell" onclick="openTrade('${s}','sell')">Sell</button></div></div>`).join('');
}
function openTrade(symbol,side='buy'){
 const m=document.getElementById('modal');if(!m)return;
 m.classList.add('show');document.getElementById('tradeSymbol').textContent=symbol;document.getElementById('tradeName').textContent=COINS[symbol].name;document.getElementById('tradePrice').textContent=money(getPrice(symbol));document.getElementById('amount').value='100';window.tradeSide=side;updateTrade();
}
function closeTrade(){document.getElementById('modal')?.classList.remove('show')}
function setSide(s){window.tradeSide=s;document.getElementById('buyTab').classList.toggle('active',s==='buy');document.getElementById('sellTab').classList.toggle('active',s==='sell');updateTrade()}
function updateTrade(){const a=Number(document.getElementById('amount')?.value||0),s=document.getElementById('tradeSymbol')?.textContent||'BTC',q=a/getPrice(s),fee=a*.001;document.getElementById('qty').textContent=q.toFixed(q<1?6:3);document.getElementById('fee').textContent=money(fee);document.getElementById('cost').textContent=money(a+fee)}
function executeTrade(){
 const s=document.getElementById('tradeSymbol').textContent,a=Number(document.getElementById('amount').value),price=getPrice(s),fee=a*.001;
 if(!a||a<=0)return alert('Enter a valid amount.');
 if(window.tradeSide==='buy'){
   if(a+fee>demo.cash)return alert('Not enough demo balance. Add balance first.');
   demo.cash-=a+fee;let p=demo.positions[s]||{qty:0,cost:0};p.qty+=a/price;p.cost+=a+fee;demo.positions[s]=p;
 }else{
   let p=demo.positions[s];if(!p||p.qty<=0)return alert(`You don't own any ${s} yet.`);
   const qty=Math.min(a/price,p.qty);const proceeds=qty*price-fee;const avg=p.cost/p.qty;p.qty-=qty;p.cost-=avg*qty;demo.cash+=proceeds;if(p.qty<1e-10)delete demo.positions[s];
 }
 demo.orders.unshift({side:window.tradeSide,symbol:s,amount:a,price,time:new Date().toLocaleString()});demo.orders=demo.orders.slice(0,30);save();closeTrade();showToast(`${window.tradeSide==='buy'?'Bought':'Sold'} ${s} for ${money(a)}`);renderPage();
}
function addBalance(){
 const a=Number(prompt('How much demo balance would you like to add?','1000'));if(!a||a<=0)return;
 demo.cash+=a;demo.orders.unshift({side:'deposit',symbol:'USD',amount:a,price:1,time:new Date().toLocaleString()});save();renderPage();showToast(`Added ${money(a)} demo balance`);
}
function resetDemo(){if(confirm('Reset your demo account to $10,000?')){demo={cash:10000,positions:{},orders:[],started:Date.now(),challenge:null};save();renderPage()}}
function showToast(t){const x=document.getElementById('toast');if(x){x.textContent='✓ '+t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),3000)}}
function drawChart(){
 const c=document.getElementById('performanceChart');if(!c)return;const ctx=c.getContext('2d'),w=c.width=c.clientWidth*2,h=c.height=c.clientHeight*2;ctx.scale(2,2);const W=c.clientWidth,H=c.clientHeight;
 ctx.clearRect(0,0,W,H);ctx.strokeStyle='#20253b';ctx.lineWidth=1;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,H*i/5);ctx.lineTo(W,H*i/5);ctx.stroke()}
 let base=portfolioValue(),pts=[];for(let i=0;i<45;i++){let y=base+(Math.sin(i*.55)*35)+(Math.random()*55-25);pts.push(y)}ctx.beginPath();pts.forEach((v,i)=>{let x=i*(W/(pts.length-1)),y=H-((v-Math.min(...pts))/(Math.max(...pts)-Math.min(...pts)||1))*(H-25)-12;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle='#9b6cff';ctx.lineWidth=2.5;ctx.stroke();
}
function renderPortfolio(){
 if(!document.getElementById('holdings'))return;renderCommon();
 document.getElementById('invested').textContent=money(invested());
 const hold=document.getElementById('holdings');const entries=Object.entries(demo.positions);
 hold.innerHTML=entries.length?entries.map(([s,p])=>{let val=p.qty*getPrice(s),gain=val-p.cost;return `<tr><td><div class="asset"><div class="coin ${COINS[s].class}">${COINS[s].emoji}</div><b>${s}</b></div></td><td>${p.qty.toFixed(p.qty<1?6:2)}</td><td>${money(p.cost/p.qty)}</td><td>${money(getPrice(s))}</td><td>${money(val)}</td><td class="${gain>=0?'green':'red'}">${gain>=0?'+':''}${money(gain)}</td><td><button class="btn sell" onclick="openTrade('${s}','sell')">Sell</button></td></tr>`}).join(''):`<tr><td colspan="7" class="muted" style="text-align:center;padding:35px">No positions yet. Go to Markets and place your first demo trade.</td></tr>`;
 const hist=document.getElementById('history');hist.innerHTML=demo.orders.length?demo.orders.slice(0,8).map(o=>`<tr><td>${o.time}</td><td class="${o.side==='buy'?'green':o.side==='sell'?'red':'muted'}">${o.side.toUpperCase()}</td><td>${o.symbol}</td><td>${o.side==='deposit'?'+':''}${money(o.amount)}</td><td>${o.side==='deposit'?'Completed':'Filled'}</td></tr>`).join(''):`<tr><td colspan="5" class="muted" style="text-align:center;padding:25px">No activity yet.</td></tr>`;
 drawChart();
}
function startChallenge(name,target,hours){
 if(demo.challenge)return alert('You already have an active challenge. Finish or reset it first.');
 demo.challenge={name,target,startBalance:demo.cash,start:Date.now(),hours};save();renderPage();showToast('Challenge started — good luck!');
}
function renderChallenges(){
 const box=document.getElementById('challengeStatus');if(!box)return;
 if(!demo.challenge){box.innerHTML='<b>No active challenge</b><div class="muted" style="font-size:12px;margin-top:6px">Pick a challenge below to begin.</div>';return}
 const ch=demo.challenge,elapsed=(Date.now()-ch.start)/3600000,remain=Math.max(0,ch.hours-elapsed),progress=Math.min(100,Math.max(0,((demo.cash-ch.startBalance)/(ch.target-ch.startBalance))*100));
 box.innerHTML=`<b>${ch.name}</b><div class="muted" style="font-size:12px;margin:7px 0">Target ${money(ch.target)} cash · ${remain.toFixed(1)}h remaining</div><div class="progress"><span style="width:${progress}%"></span></div><div style="font-size:11px;margin-top:7px">Starting ${money(ch.startBalance)} · Current ${money(demo.cash)}</div>${demo.cash>=ch.target?'<div class="green" style="margin-top:8px">🏆 Challenge complete!</div>':''}`;
}
function renderPage(){renderCommon();renderMarkets();renderPortfolio();renderChallenges();drawChart()}
document.addEventListener('input',e=>{if(e.target.id==='search')renderMarkets();if(e.target.id==='amount')updateTrade()});
document.addEventListener('click',e=>{if(e.target.matches('.tab')){document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));e.target.classList.add('active');renderMarkets()}});
window.addEventListener('load',()=>{renderPage();loadPrices();setInterval(loadPrices,30000)});
