/* ════════════════════════════════════════════════════════
   BMDX GAJINO CASE STUDY — DIAGRAM GENERATOR
   Self-contained. Injects the hero "Learning Universe" SVG.
═══════════════════════════════════════════════════════════ */
(function(){

var NS = "http://www.w3.org/2000/svg";
var SUN   = "#FFC93C";
var SKY   = "#4FB6E8";
var GRASS = "#6FCF7C";
var BERRY = "#F2618C";

function el(tag, attrs, parent){
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/* ──────────────────────────────────────────────────────
   HERO — phone "Desk" home screen + orbiting feature icons
─────────────────────────────────────────────────────── */
function buildHeroDiagram(mount){
  var W = 900, H = 560;
  var svg = el('svg', { viewBox: '0 0 '+W+' '+H, xmlns: NS });
  mount.appendChild(svg);

  var cx = W/2, cy = H/2;

  var features = [
    { label:'Video Lessons', icon:'🎬', angle:-140, color:BERRY },
    { label:'Tests',         icon:'📝', angle:-40,  color:SKY   },
    { label:'Books',         icon:'📚', angle:40,   color:SUN   },
    { label:'Notebook',      icon:'📓', angle:140,  color:GRASS },
    { label:'Ranking',       icon:'🏆', angle:180,  color:BERRY }
  ];

  var R = 280;
  var lineGroup = el('g', {}, svg);
  var nodeGroup = el('g', {}, svg);

  features.forEach(function(f){
    var rad = f.angle * Math.PI/180;
    var fx = cx + R*Math.cos(rad);
    var fy = cy + R*Math.sin(rad)*0.58;
    f._x = fx; f._y = fy;
    el('line', { x1:cx, y1:cy, x2:fx, y2:fy, stroke:'rgba(255,255,255,0.09)', 'stroke-width':'1.2' }, lineGroup);
  });

  /* phone frame — "Desk" home screen */
  var phoneW = 210, phoneH = 390;
  var px = cx - phoneW/2, py = cy - phoneH/2;

  el('rect', { x:px, y:py, width:phoneW, height:phoneH, rx:28, fill:'#070707', stroke:'rgba(255,255,255,0.18)', 'stroke-width':'1.6' }, nodeGroup);
  el('rect', { x:px+10, y:py+20, width:phoneW-20, height:phoneH-40, rx:14, fill:'rgba(255,255,255,0.02)' }, nodeGroup);

  /* avatar + greeting */
  var headY = py + 42;
  el('circle', { cx:px+34, cy:headY, r:16, fill:'rgba(255,201,60,0.16)', stroke:SUN, 'stroke-width':'1.4' }, nodeGroup);
  var avatarEmoji = el('text', { x:px+34, y:headY+5, 'text-anchor':'middle', 'font-size':'14' }, nodeGroup);
  avatarEmoji.textContent = '🙂';
  var hello = el('text', { x:px+58, y:headY-3, fill:'rgba(255,255,255,0.85)', 'font-size':'10.5', 'font-weight':'600', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  hello.textContent = 'Hi, Mani!';
  var helloSub = el('text', { x:px+58, y:headY+11, fill:'rgba(255,255,255,0.4)', 'font-size':'8.5', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
  helloSub.textContent = 'Your desk is ready';

  /* desk surface */
  var deskY = headY + 36;
  el('rect', { x:px+12, y:deskY, width:phoneW-24, height:phoneH-40-72, rx:12, fill:'rgba(255,255,255,0.025)', stroke:'rgba(255,255,255,0.08)', 'stroke-width':'1' }, nodeGroup);

  /* subject cards on desk */
  var cardColors = [
    { c: SUN,   label:'Math' },
    { c: SKY,   label:'Science' },
    { c: GRASS, label:'Reading' }
  ];
  var cardW = (phoneW-24-12-2*8)/3;
  cardColors.forEach(function(card, i){
    var cx2 = px+12+8 + i*(cardW+8);
    var cy2 = deskY+12;
    el('rect', { x:cx2, y:cy2, width:cardW, height:64, rx:9, fill: hexToRgba(card.c,0.14), stroke: hexToRgba(card.c,0.4), 'stroke-width':'1' }, nodeGroup);
    var lbl = el('text', { x:cx2+cardW/2, y:cy2+58, 'text-anchor':'middle', fill:'rgba(255,255,255,0.6)', 'font-size':'7.5', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup);
    lbl.textContent = card.label;
  });

  /* progress row */
  var progY = deskY + 92;
  el('text', { x:px+20, y:progY, fill:'rgba(255,255,255,0.5)', 'font-size':'8', 'font-family':'Helvetica Neue, Arial, sans-serif' }, nodeGroup).textContent = 'Today\u2019s progress';
  el('rect', { x:px+20, y:progY+8, width:phoneW-40, height:7, rx:3.5, fill:'rgba(255,255,255,0.08)' }, nodeGroup);
  el('rect', { x:px+20, y:progY+8, width:(phoneW-40)*0.68, height:7, rx:3.5, fill:SUN }, nodeGroup);

  /* stars row */
  var starsY = progY + 32;
  for (var s=0;s<5;s++){
    var sx = px+20 + s*22;
    var star = el('text', { x:sx, y:starsY, fill: s<3 ? SUN : 'rgba(255,255,255,0.15)', 'font-size':'14' }, nodeGroup);
    star.textContent = '★';
  }

  /* bottom nav dots */
  var navY = py + phoneH - 18;
  ['🗂️','📚','🏆','👤'].forEach(function(ic, i){
    var nx = px + phoneW/2 - 60 + i*40;
    var t = el('text', { x:nx, y:navY, 'text-anchor':'middle', 'font-size':'12', opacity: i===0?'1':'0.4' }, nodeGroup);
    t.textContent = ic;
  });

  /* feature satellite nodes */
  features.forEach(function(f){
    var g = el('g', {}, nodeGroup);
    var r = 20;
    var circle = el('circle', { cx:f._x, cy:f._y, r:r, fill:'#050505', stroke: f.color, 'stroke-width':'1.6' }, g);
    var emoji = el('text', { x:f._x, y:f._y+6, 'text-anchor':'middle', 'font-size':'15' }, g);
    emoji.textContent = f.icon;

    var dx = f._x - cx;
    var anchor = dx > 5 ? 'start' : (dx < -5 ? 'end' : 'middle');
    var lx = f._x + (dx>0? r+10 : -(r+10));
    var text = el('text', {
      x:lx, y:f._y+4, 'text-anchor':anchor, fill:'rgba(255,255,255,0.75)',
      'font-size':'12', 'font-family':'Helvetica Neue, Arial, sans-serif'
    }, g);
    text.textContent = f.label;

    g.addEventListener('mouseenter', function(){
      circle.setAttribute('r', 23);
      circle.setAttribute('fill', hexToRgba(f.color, 0.12));
      text.setAttribute('fill', '#fff');
    });
    g.addEventListener('mouseleave', function(){
      circle.setAttribute('r', 20);
      circle.setAttribute('fill', '#050505');
      text.setAttribute('fill', 'rgba(255,255,255,0.75)');
    });
  });
}

function hexToRgba(hex, a){
  var c = hex.replace('#','');
  var r = parseInt(c.substring(0,2),16);
  var g = parseInt(c.substring(2,4),16);
  var b = parseInt(c.substring(4,6),16);
  return 'rgba('+r+','+g+','+b+','+a+')';
}

/* ──────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────── */
function init(){
  var heroMount = document.getElementById('svg-hero-mount');
  if (heroMount) buildHeroDiagram(heroMount);
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
