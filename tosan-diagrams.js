/* ════════════════════════════════════════════════════════
   BMDX TOSAN CASE STUDY — SVG DIAGRAM GENERATORS
   Self-contained. Injects real SVG diagrams into mount points.
═══════════════════════════════════════════════════════════ */
(function(){

var NS = "http://www.w3.org/2000/svg";
var CYAN = "#06B6D4";
var BLUE = "#2563EB";
var GRAY = "rgba(255,255,255,0.5)";

function el(tag, attrs, parent){
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* ──────────────────────────────────────────────────────
   1. HERO ECOSYSTEM — hub & spoke
─────────────────────────────────────────────────────── */
function buildHeroDiagram(mount){
  var W = 900, H = 560;
  var svg = el('svg', { viewBox: '0 0 '+W+' '+H, xmlns: NS });
  mount.appendChild(svg);

  var cx = W/2, cy = H/2, R = 210;
  var products = [
    'Mobile Banking','Internet Banking','Admin Panel','Authentication',
    'Transaction Flows','CRM / Back Office','Merchant Services','Reporting Dashboard'
  ];
  var n = products.length;

  /* connector lines first (under everything) */
  var lineGroup = el('g', {}, svg);
  var nodeGroup = el('g', {}, svg);

  var positions = [];
  for (var i=0;i<n;i++){
    var angle = (Math.PI*2/n)*i - Math.PI/2;
    var x = cx + R*Math.cos(angle);
    var y = cy + R*Math.sin(angle);
    positions.push({x:x,y:y,label:products[i]});
  }

  positions.forEach(function(p){
    var line = el('line', {
      x1:cx, y1:cy, x2:p.x, y2:p.y,
      stroke:'rgba(255,255,255,0.14)', 'stroke-width':'1.2'
    }, lineGroup);
  });

  /* center hub */
  var hubR = 78;
  el('circle', { cx:cx, cy:cy, r:hubR+18, fill:'none', stroke:'rgba(6,182,212,0.18)', 'stroke-width':'1' }, nodeGroup);
  var hubCircle = el('circle', { cx:cx, cy:cy, r:hubR, fill:'#050505', stroke:CYAN, 'stroke-width':'1.6' }, nodeGroup);
  var hubText1 = el('text', { x:cx, y:cy-6, 'text-anchor':'middle', fill:'#fff', 'font-size':'15', 'font-weight':'700', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  hubText1.textContent = 'TOSAN';
  var hubText2 = el('text', { x:cx, y:cy+16, 'text-anchor':'middle', fill:CYAN, 'font-size':'11', 'letter-spacing':'1.5', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  hubText2.textContent = 'ATOMIC CORE';

  /* product nodes */
  positions.forEach(function(p, i){
    var g = el('g', { class:'bmdx-node', style:'cursor:default;' }, nodeGroup);
    var nodeR = 8;
    var circle = el('circle', { cx:p.x, cy:p.y, r:nodeR, fill:'#050505', stroke:'rgba(255,255,255,0.45)', 'stroke-width':'1.4' }, g);

    /* label position: push outward */
    var dx = p.x - cx, dy = p.y - cy;
    var dist = Math.sqrt(dx*dx+dy*dy);
    var lx = p.x + (dx/dist)*70;
    var ly = p.y + (dy/dist)*70;
    var anchor = dx > 5 ? 'start' : (dx < -5 ? 'end' : 'middle');

    var labelBg = el('rect', { x:0,y:0,width:0,height:0, fill:'transparent' }, g);
    var text = el('text', {
      x:lx, y:ly, 'text-anchor':anchor, fill:'rgba(255,255,255,0.78)',
      'font-size':'12.5', 'font-family':'Helvetica Neue, Arial, sans-serif', 'dominant-baseline':'middle'
    }, g);
    text.textContent = p.label;

    /* hover interaction */
    g.addEventListener('mouseenter', function(){
      circle.setAttribute('fill', CYAN);
      circle.setAttribute('r', 10);
      text.setAttribute('fill', '#fff');
    });
    g.addEventListener('mouseleave', function(){
      circle.setAttribute('fill', '#050505');
      circle.setAttribute('r', 8);
      text.setAttribute('fill', 'rgba(255,255,255,0.78)');
    });
  });

  /* breathing animation on hub */
  var pulse = el('animate', {
    attributeName:'r', values: (hubR)+';'+(hubR+4)+';'+(hubR),
    dur:'4s', repeatCount:'indefinite'
  });
  hubCircle.appendChild(pulse);
}

/* ──────────────────────────────────────────────────────
   2. BEFORE / AFTER FRAGMENTATION
─────────────────────────────────────────────────────── */
function buildBeforeAfter(mount){
  var W = 900, H = 380;
  var svg = el('svg', { viewBox: '0 0 '+W+' '+H, xmlns: NS });
  mount.appendChild(svg);

  /* divider */
  el('line', { x1:W/2, y1:20, x2:W/2, y2:H-20, stroke:'rgba(255,255,255,0.1)', 'stroke-dasharray':'4 6' }, svg);

  /* labels */
  var beforeLabel = el('text', { x: W*0.25, y:30, 'text-anchor':'middle', fill:'rgba(239,68,68,0.85)', 'font-size':'12', 'letter-spacing':'2', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
  beforeLabel.textContent = 'BEFORE';
  var afterLabel = el('text', { x: W*0.75, y:30, 'text-anchor':'middle', fill:CYAN, 'font-size':'12', 'letter-spacing':'2', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
  afterLabel.textContent = 'AFTER';

  /* BEFORE: scattered boxes, broken connectors */
  var beforeItems = [
    {label:'Team A → Button A', x:80, y:90},
    {label:'Team B → Button B', x:230, y:160},
    {label:'Team C → Form C',   x:60,  y:230},
    {label:'Team D → Modal D',  x:240, y:300}
  ];
  beforeItems.forEach(function(it, i){
    var g = el('g', {}, svg);
    var w = 150, h = 40;
    var rot = (i%2===0 ? -2 : 2);
    el('rect', {
      x:it.x, y:it.y, width:w, height:h, rx:6,
      fill:'rgba(239,68,68,0.05)', stroke:'rgba(239,68,68,0.4)', 'stroke-width':'1',
      transform:'rotate('+rot+' '+(it.x+w/2)+' '+(it.y+h/2)+')'
    }, g);
    var t = el('text', { x:it.x+w/2, y:it.y+h/2+4, 'text-anchor':'middle', fill:'rgba(255,255,255,0.62)', 'font-size':'11', 'font-family':'Helvetica Neue, Arial, sans-serif' }, g);
    t.textContent = it.label;
  });
  /* broken connector squiggles between before boxes */
  el('path', { d:'M 230 110 Q 200 130 230 160', stroke:'rgba(239,68,68,0.25)', 'stroke-width':'1.2', fill:'none', 'stroke-dasharray':'3 4' }, svg);
  el('path', { d:'M 135 130 Q 80 180 135 230', stroke:'rgba(239,68,68,0.25)', 'stroke-width':'1.2', fill:'none', 'stroke-dasharray':'3 4' }, svg);
  el('path', { d:'M 230 200 Q 280 250 240 300', stroke:'rgba(239,68,68,0.25)', 'stroke-width':'1.2', fill:'none', 'stroke-dasharray':'3 4' }, svg);

  /* AFTER: clean hub with 4 connected nodes */
  var hubX = W*0.75, hubY = H/2;
  var afterItems = [
    {label:'Unified Tokens',      dx:-110, dy:-70},
    {label:'Shared Components',   dx:110,  dy:-70},
    {label:'Standard Patterns',   dx:-110, dy:70},
    {label:'Documentation',       dx:110,  dy:70}
  ];
  afterItems.forEach(function(it){
    var x = hubX+it.dx, y = hubY+it.dy;
    el('line', { x1:hubX, y1:hubY, x2:x, y2:y, stroke:'rgba(6,182,212,0.3)', 'stroke-width':'1.3' }, svg);
  });
  el('circle', { cx:hubX, cy:hubY, r:34, fill:'#050505', stroke:CYAN, 'stroke-width':'1.6' }, svg);
  var hubT = el('text', { x:hubX, y:hubY+4, 'text-anchor':'middle', fill:'#fff', 'font-size':'10.5', 'font-weight':'600', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
  hubT.textContent = 'CORE';

  afterItems.forEach(function(it){
    var x = hubX+it.dx, y = hubY+it.dy;
    var g = el('g', {}, svg);
    var w = 130, h = 36;
    el('rect', { x:x-w/2, y:y-h/2, width:w, height:h, rx:7, fill:'rgba(6,182,212,0.06)', stroke:'rgba(6,182,212,0.5)', 'stroke-width':'1' }, g);
    var t = el('text', { x:x, y:y+4, 'text-anchor':'middle', fill:'rgba(255,255,255,0.85)', 'font-size':'10.5', 'font-family':'Helvetica Neue, Arial, sans-serif' }, g);
    t.textContent = it.label;
  });
}

/* ──────────────────────────────────────────────────────
   3. ATOMIC ARCHITECTURE — 4 layers
─────────────────────────────────────────────────────── */
function buildArchitecture(mount){
  var layers = [
    { title:'Layer 1 — Design Tokens', items:['Color','Typography','Spacing','Radius','Elevation','Motion'] },
    { title:'Layer 2 — Core Components', items:['Buttons','Inputs','Tables','Modals','Cards','Navigation'] },
    { title:'Layer 3 — Product Patterns', items:['Authentication','Financial Transaction','Data Management','Dashboard Workflows','Error Handling'] },
    { title:'Layer 4 — Product Experiences', items:['Mobile App','Web Dashboard','Admin Panel','Enterprise Workflows'] }
  ];

  var wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '10px';
  mount.appendChild(wrap);

  layers.forEach(function(layer, idx){
    var row = document.createElement('div');
    row.style.border = '1px solid rgba(255,255,255,0.1)';
    row.style.borderRadius = '12px';
    row.style.padding = '18px 22px';
    row.style.background = 'rgba(255,255,255,0.02)';
    row.style.transition = 'border-color 0.3s ease, background 0.3s ease';

    var titleEl = document.createElement('div');
    titleEl.textContent = layer.title;
    titleEl.style.fontSize = '0.72rem';
    titleEl.style.letterSpacing = '0.1em';
    titleEl.style.textTransform = 'uppercase';
    titleEl.style.color = idx===0 ? CYAN : 'rgba(255,255,255,0.45)';
    titleEl.style.marginBottom = '12px';
    row.appendChild(titleEl);

    var chipsWrap = document.createElement('div');
    chipsWrap.style.display = 'flex';
    chipsWrap.style.flexWrap = 'wrap';
    chipsWrap.style.gap = '8px';

    layer.items.forEach(function(item){
      var chip = document.createElement('span');
      chip.textContent = item;
      chip.style.fontSize = '0.78rem';
      chip.style.padding = '7px 14px';
      chip.style.borderRadius = '20px';
      chip.style.border = '1px solid rgba(255,255,255,0.14)';
      chip.style.color = 'rgba(255,255,255,0.75)';
      chip.style.transition = 'border-color 0.25s ease, color 0.25s ease, background 0.25s ease';
      chip.addEventListener('mouseenter', function(){
        chip.style.borderColor = CYAN;
        chip.style.color = '#fff';
        chip.style.background = 'rgba(6,182,212,0.08)';
      });
      chip.addEventListener('mouseleave', function(){
        chip.style.borderColor = 'rgba(255,255,255,0.14)';
        chip.style.color = 'rgba(255,255,255,0.75)';
        chip.style.background = 'transparent';
      });
      chipsWrap.appendChild(chip);
    });
    row.appendChild(chipsWrap);
    wrap.appendChild(row);

    if (idx < layers.length-1){
      var arrowWrap = document.createElement('div');
      arrowWrap.style.textAlign = 'center';
      arrowWrap.style.color = 'rgba(255,255,255,0.25)';
      arrowWrap.style.fontSize = '0.9rem';
      arrowWrap.textContent = '↓';
      wrap.appendChild(arrowWrap);
    }
  });
}

/* ──────────────────────────────────────────────────────
   4. DESIGN TOKENS VISUAL
─────────────────────────────────────────────────────── */
function buildTokens(mount){
  var wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
  wrap.style.gap = '16px';
  mount.appendChild(wrap);

  function makeRow(label, value, swatchColor){
    var row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '12px';
    row.style.padding = '12px 14px';
    row.style.border = '1px solid rgba(255,255,255,0.09)';
    row.style.borderRadius = '8px';
    row.style.background = 'rgba(255,255,255,0.02)';

    var swatch = document.createElement('div');
    swatch.style.width = '22px';
    swatch.style.height = '22px';
    swatch.style.borderRadius = '5px';
    swatch.style.flexShrink = '0';
    swatch.style.background = swatchColor || 'rgba(255,255,255,0.15)';
    swatch.style.border = '1px solid rgba(255,255,255,0.15)';
    row.appendChild(swatch);

    var textWrap = document.createElement('div');
    var l = document.createElement('div');
    l.textContent = label;
    l.style.fontSize = '0.62rem';
    l.style.letterSpacing = '0.05em';
    l.style.color = 'rgba(255,255,255,0.4)';
    l.style.fontFamily = "'SFMono-Regular', Consolas, Menlo, monospace";
    var v = document.createElement('div');
    v.textContent = value;
    v.style.fontSize = '0.85rem';
    v.style.color = 'rgba(255,255,255,0.85)';
    textWrap.appendChild(l); textWrap.appendChild(v);
    row.appendChild(textWrap);
    return row;
  }

  wrap.appendChild(makeRow('color / primary / 500', '#2563EB', '#2563EB'));
  wrap.appendChild(makeRow('color / success / 600', '#06B6D4', '#06B6D4'));
  wrap.appendChild(makeRow('color / navy / 900', '#0B1F3A', '#0B1F3A'));
  wrap.appendChild(makeRow('spacing / 08', '8px', null));
  wrap.appendChild(makeRow('radius / medium', '8px', null));
  wrap.appendChild(makeRow('typography / body / medium', 'Inter · 16/24', null));
}

/* ──────────────────────────────────────────────────────
   5. WORKFLOW — design to dev
─────────────────────────────────────────────────────── */
function buildWorkflow(mount){
  var steps = ['Figma Library','Design Specs','Component Documentation','Frontend Implementation','QA Checklist','Product Release'];
  var wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.alignItems = 'center';
  mount.appendChild(wrap);

  steps.forEach(function(s, i){
    var step = document.createElement('div');
    step.textContent = s;
    step.style.width = '100%';
    step.style.maxWidth = '420px';
    step.style.background = i===steps.length-1 ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.04)';
    step.style.border = i===steps.length-1 ? '1px solid '+CYAN : '1px solid rgba(255,255,255,0.12)';
    step.style.borderRadius = '10px';
    step.style.padding = '14px 20px';
    step.style.textAlign = 'center';
    step.style.fontSize = '0.86rem';
    step.style.fontWeight = '500';
    step.style.color = 'rgba(255,255,255,0.85)';
    step.style.transition = 'border-color 0.3s ease, background 0.3s ease';
    step.addEventListener('mouseenter', function(){
      step.style.borderColor = CYAN;
      step.style.background = 'rgba(6,182,212,0.07)';
    });
    step.addEventListener('mouseleave', function(){
      step.style.borderColor = i===steps.length-1 ? CYAN : 'rgba(255,255,255,0.12)';
      step.style.background = i===steps.length-1 ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.04)';
    });
    wrap.appendChild(step);

    if (i < steps.length-1){
      var arrow = document.createElement('div');
      arrow.textContent = '↓';
      arrow.style.color = 'rgba(255,255,255,0.25)';
      arrow.style.fontSize = '1.1rem';
      arrow.style.margin = '6px 0';
      wrap.appendChild(arrow);
    }
  });
}

/* ──────────────────────────────────────────────────────
   INIT — mount everything once DOM is ready
─────────────────────────────────────────────────────── */
function init(){
  var heroMount = document.getElementById('svg-hero-mount');
  if (heroMount) buildHeroDiagram(heroMount);

  var baMount = document.getElementById('svg-before-after-mount');
  if (baMount) buildBeforeAfter(baMount);

  var archMount = document.getElementById('svg-architecture-mount');
  if (archMount) buildArchitecture(archMount);

  var tokensMount = document.getElementById('svg-tokens-mount');
  if (tokensMount) buildTokens(tokensMount);

  var workflowMount = document.getElementById('svg-workflow-mount');
  if (workflowMount) buildWorkflow(workflowMount);
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
