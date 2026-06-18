/* ════════════════════════════════════════════════════════
   BMDX ZABANSHENAS CASE STUDY — DIAGRAM GENERATORS
   Self-contained. Injects real SVG/HTML diagrams into mount points.
═══════════════════════════════════════════════════════════ */
(function(){

var NS = "http://www.w3.org/2000/svg";
var CORAL = "#FF6B5B";
var AMBER = "#FFB84D";
var MINT  = "#3DDC97";
var VIOLET= "#7C6CF6";

function el(tag, attrs, parent){
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* ──────────────────────────────────────────────────────
   1. HERO — central active app screen + feature satellites
─────────────────────────────────────────────────────── */
function buildHeroDiagram(mount){
  var W = 900, H = 540;
  var svg = el('svg', { viewBox: '0 0 '+W+' '+H, xmlns: NS });
  mount.appendChild(svg);

  var cx = W/2, cy = H/2;

  /* central phone mock */
  var phoneW = 200, phoneH = 380;
  var px = cx - phoneW/2, py = cy - phoneH/2;

  var features = [
    { label:'Interactive Player', angle:-150, color:CORAL },
    { label:'SRS Flashcards',     angle:-30,  color:AMBER },
    { label:'Statistics',         angle:30,   color:MINT  },
    { label:'Community',          angle:150,  color:VIOLET}
  ];

  var R = 270;
  var lineGroup = el('g', {}, svg);
  var nodeGroup = el('g', {}, svg);

  features.forEach(function(f){
    var rad = f.angle * Math.PI/180;
    var fx = cx + R*Math.cos(rad);
    var fy = cy + R*Math.sin(rad)*0.62;
    f._x = fx; f._y = fy;
    el('line', { x1:cx, y1:cy, x2:fx, y2:fy, stroke:'rgba(255,255,255,0.10)', 'stroke-width':'1.2' }, lineGroup);
  });

  /* phone frame */
  el('rect', { x:px, y:py, width:phoneW, height:phoneH, rx:26, fill:'#070707', stroke:'rgba(255,255,255,0.18)', 'stroke-width':'1.6' }, nodeGroup);
  el('rect', { x:px+10, y:py+18, width:phoneW-20, height:phoneH-36, rx:14, fill:'rgba(255,255,255,0.02)' }, nodeGroup);

  /* streak/progress mock inside phone */
  var headerY = py+38;
  el('circle', { cx: px+34, cy: headerY, r:14, fill:'none', stroke:CORAL, 'stroke-width':'3', 'stroke-dasharray':'52 88', 'stroke-linecap':'round', transform:'rotate(-90 '+(px+34)+' '+headerY+')' }, nodeGroup);
  var streakText = el('text', { x:px+34, y:headerY+4, 'text-anchor':'middle', fill:'#fff', 'font-size':'11', 'font-weight':'700', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  streakText.textContent = '7';
  var streakLabel = el('text', { x:px+58, y:headerY-3, fill:'rgba(255,255,255,0.85)', 'font-size':'10.5', 'font-weight':'600', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  streakLabel.textContent = 'Day Streak';
  var streakSub = el('text', { x:px+58, y:headerY+11, fill:'rgba(255,255,255,0.4)', 'font-size':'8.5', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  streakSub.textContent = 'Keep it going!';

  /* lesson rows */
  var rowY = headerY + 42;
  var rowLabels = ['Unit 4 · Lesson 2', 'Unit 4 · Lesson 3', 'Unit 5 · Lesson 1'];
  rowLabels.forEach(function(label, i){
    var ry = rowY + i*46;
    var done = i < 1;
    el('rect', { x:px+12, y:ry, width:phoneW-24, height:36, rx:9, fill: done ? 'rgba(61,220,151,0.10)' : 'rgba(255,255,255,0.03)', stroke: done? 'rgba(61,220,151,0.4)':'rgba(255,255,255,0.1)', 'stroke-width':'1' }, nodeGroup);
    var t = el('text', { x:px+24, y:ry+22, fill: done? MINT : 'rgba(255,255,255,0.6)', 'font-size':'9.5', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
    t.textContent = label;
    var mark = el('text', { x:px+phoneW-26, y:ry+23, 'text-anchor':'end', fill: done? MINT : 'rgba(255,255,255,0.3)', 'font-size':'11', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
    mark.textContent = done ? '✓' : '→';
  });

  /* XP bar at bottom of phone */
  var xpY = py + phoneH - 36;
  el('rect', { x:px+12, y:xpY, width:phoneW-24, height:8, rx:4, fill:'rgba(255,255,255,0.08)' }, nodeGroup);
  el('rect', { x:px+12, y:xpY, width:(phoneW-24)*0.62, height:8, rx:4, fill:AMBER }, nodeGroup);
  var xpLabel = el('text', { x:px+12, y:xpY-7, fill:'rgba(255,255,255,0.45)', 'font-size':'8', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  xpLabel.textContent = '620 / 1000 XP';

  /* feature satellite nodes */
  features.forEach(function(f){
    var g = el('g', {}, nodeGroup);
    var r = 9;
    var circle = el('circle', { cx:f._x, cy:f._y, r:r, fill:'#050505', stroke:f.color, 'stroke-width':'1.6' }, g);
    var dx = f._x - cx;
    var anchor = dx > 5 ? 'start' : (dx < -5 ? 'end' : 'middle');
    var lx = f._x + (dx>0? 16 : -16);
    var text = el('text', {
      x:lx, y:f._y+4, 'text-anchor':anchor, fill:'rgba(255,255,255,0.78)',
      'font-size':'12.5', 'font-family':'Helvetica Neue, Arial, sans-serif'
    }, g);
    text.textContent = f.label;

    g.addEventListener('mouseenter', function(){
      circle.setAttribute('fill', f.color);
      circle.setAttribute('r', 11);
      text.setAttribute('fill', '#fff');
    });
    g.addEventListener('mouseleave', function(){
      circle.setAttribute('fill', '#050505');
      circle.setAttribute('r', 9);
      text.setAttribute('fill', 'rgba(255,255,255,0.78)');
    });
  });

  /* platform tags under phone */
  var tagY = py + phoneH + 34;
  var tags = ['Android', 'iOS', 'Web'];
  var totalW = tags.length * 80;
  tags.forEach(function(t, i){
    var tx = cx - totalW/2 + i*80 + 40;
    el('rect', { x:tx-34, y:tagY-13, width:68, height:24, rx:12, fill:'rgba(255,255,255,0.04)', stroke:'rgba(255,255,255,0.15)', 'stroke-width':'1' }, svg);
    var tt = el('text', { x:tx, y:tagY+3, 'text-anchor':'middle', fill:'rgba(255,255,255,0.65)', 'font-size':'10', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
    tt.textContent = t;
  });
}

/* ──────────────────────────────────────────────────────
   2. MULTI-PLATFORM COMPONENT SCALE
─────────────────────────────────────────────────────── */
function buildPlatformDiagram(mount){
  var platforms = [
    { name:'Android', w:90,  h:150, cardH:40 },
    { name:'Web',      w:200, h:130, cardH:36 },
    { name:'iOS',      w:90,  h:150, cardH:40 }
  ];

  var wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'flex-end';
  wrap.style.justifyContent = 'center';
  wrap.style.gap = '40px';
  wrap.style.flexWrap = 'wrap';
  wrap.style.padding = '20px 0';
  mount.appendChild(wrap);

  platforms.forEach(function(p){
    var col = document.createElement('div');
    col.style.textAlign = 'center';

    var frame = document.createElement('div');
    frame.style.width = p.w + 'px';
    frame.style.height = p.h + 'px';
    frame.style.background = 'rgba(255,255,255,0.04)';
    frame.style.border = '1px solid rgba(255,255,255,0.16)';
    frame.style.borderRadius = p.name === 'Web' ? '8px' : '18px';
    frame.style.display = 'flex';
    frame.style.flexDirection = 'column';
    frame.style.alignItems = 'center';
    frame.style.justifyContent = 'center';
    frame.style.padding = '10px';
    frame.style.gap = '8px';
    frame.style.margin = '0 auto 14px';
    frame.style.transition = 'border-color 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)';

    var card = document.createElement('div');
    card.style.width = '100%';
    card.style.height = p.cardH + 'px';
    card.style.background = 'rgba(255,107,91,0.18)';
    card.style.border = '1px solid rgba(255,107,91,0.4)';
    card.style.borderRadius = '6px';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.fontSize = '9px';
    card.style.color = 'rgba(255,255,255,0.7)';
    card.style.fontFamily = 'Helvetica Neue, Arial, sans-serif';
    card.textContent = 'Lesson Card';

    var card2 = card.cloneNode(true);
    card2.style.height = (p.cardH * 0.6) + 'px';
    card2.style.opacity = '0.6';
    card2.textContent = '';

    frame.appendChild(card);
    frame.appendChild(card2);

    frame.addEventListener('mouseenter', function(){
      frame.style.borderColor = CORAL;
      frame.style.transform = 'translateY(-4px)';
    });
    frame.addEventListener('mouseleave', function(){
      frame.style.borderColor = 'rgba(255,255,255,0.16)';
      frame.style.transform = 'translateY(0)';
    });

    var label = document.createElement('div');
    label.textContent = p.name;
    label.style.fontSize = '0.78rem';
    label.style.color = 'rgba(255,255,255,0.55)';
    label.style.letterSpacing = '0.05em';

    col.appendChild(frame);
    col.appendChild(label);
    wrap.appendChild(col);
  });
}

/* ──────────────────────────────────────────────────────
   3. ENGAGEMENT GROWTH CHART — dual line
─────────────────────────────────────────────────────── */
function buildGrowthChart(mount){
  var W = 900, H = 320;
  var svg = el('svg', { viewBox: '0 0 '+W+' '+H, xmlns: NS });
  mount.appendChild(svg);

  var padL = 50, padR = 30, padT = 30, padB = 40;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;

  /* gridlines */
  var gridGroup = el('g', {}, svg);
  for (var i=0;i<=4;i++){
    var gy = padT + (chartH/4)*i;
    el('line', { x1:padL, y1:gy, x2:W-padR, y2:gy, stroke:'rgba(255,255,255,0.06)', 'stroke-width':'1' }, gridGroup);
  }

  /* months */
  var months = ['Launch','M1','M2','M3','M4','M5','M6'];
  var n = months.length;
  months.forEach(function(m, i){
    var x = padL + (chartW/(n-1))*i;
    var t = el('text', { x:x, y:H-14, 'text-anchor':'middle', fill:'rgba(255,255,255,0.4)', 'font-size':'10', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
    t.textContent = m;
  });

  /* engagement data (baseline 100 -> grows to 118) */
  var engagementData = [100, 103, 107, 111, 114, 117, 118];
  /* completion data (baseline 100 -> grows to 114, slower start) */
  var completionData  = [100, 100, 102, 105, 108, 112, 114];

  function dataToPoints(data, maxVal, minVal){
    return data.map(function(v, i){
      var x = padL + (chartW/(n-1))*i;
      var norm = (v - minVal) / (maxVal - minVal);
      var y = padT + chartH - norm*chartH;
      return [x,y];
    });
  }

  var maxVal = 122, minVal = 96;
  var engPoints = dataToPoints(engagementData, maxVal, minVal);
  var compPoints = dataToPoints(completionData, maxVal, minVal);

  function pointsToPath(points){
    return points.map(function(p, i){
      return (i===0?'M ':'L ') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    }).join(' ');
  }

  /* area fill under engagement line */
  var areaPath = pointsToPath(engPoints) + ' L ' + engPoints[engPoints.length-1][0] + ' ' + (padT+chartH) + ' L ' + engPoints[0][0] + ' ' + (padT+chartH) + ' Z';
  el('path', { d:areaPath, fill:'rgba(255,107,91,0.08)' }, svg);

  /* lines */
  var engPath = el('path', { d: pointsToPath(engPoints), fill:'none', stroke:CORAL, 'stroke-width':'2.4', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, svg);
  var compPath = el('path', { d: pointsToPath(compPoints), fill:'none', stroke:MINT, 'stroke-width':'2.4', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, svg);

  /* dots on points with hover tooltip */
  function addDots(points, color, data){
    points.forEach(function(p, i){
      var g = el('g', {}, svg);
      var dot = el('circle', { cx:p[0], cy:p[1], r:4, fill:'#000', stroke:color, 'stroke-width':'2' }, g);
      g.addEventListener('mouseenter', function(){ dot.setAttribute('r', 6); });
      g.addEventListener('mouseleave', function(){ dot.setAttribute('r', 4); });
    });
  }
  addDots(engPoints, CORAL, engagementData);
  addDots(compPoints, MINT, completionData);

  /* end-value badges */
  var lastEng = engPoints[engPoints.length-1];
  var lastComp = compPoints[compPoints.length-1];
  var engBadge = el('text', { x:lastEng[0]-6, y:lastEng[1]-12, 'text-anchor':'end', fill:CORAL, 'font-size':'12', 'font-weight':'700', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
  engBadge.textContent = '+18%';
  var compBadge = el('text', { x:lastComp[0]-6, y:lastComp[1]+18, 'text-anchor':'end', fill:MINT, 'font-size':'12', 'font-weight':'700', 'font-family':'Helvetica Neue, Arial, sans-serif' }, svg);
  compBadge.textContent = '+14%';
}

/* ──────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────── */
function init(){
  var heroMount = document.getElementById('svg-hero-mount');
  if (heroMount) buildHeroDiagram(heroMount);

  var platformMount = document.getElementById('svg-platform-mount');
  if (platformMount) buildPlatformDiagram(platformMount);

  var chartMount = document.getElementById('svg-chart-mount');
  if (chartMount) buildGrowthChart(chartMount);
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
