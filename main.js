import 'https://cdn.jsdelivr.net/npm/ol@10.6.1/ol.css';
import Map from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/Map.js';
import View from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/View.js';
import {Fill, Stroke, Style} from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/style.js';
import TileLayer from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/layer/Tile.js';
import {fromLonLat, toLonLat, get as getProjection} from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/proj.js';
import Graticule from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/layer/Graticule.js';
import {createEmpty, extend} from 'https://cdn.jsdelivr.net/npm/ol@10.6.1/extent.js';

// --- simple coordinate formatter
function fmtDeg(val, isLat){
  const hemi = isLat ? (val>=0?'N':'S') : (val>=0?'E':'W');
  const abs=Math.abs(val);
  const d=Math.floor(abs);
  const m=Math.floor((abs-d)*60);
  return `${d}°${m.toString().padStart(2,'0')}'${hemi}`;
}

// --- base colored canvas layer
const background = document.createElement('canvas');
background.width = background.height = 2;
const ctx = background.getContext('2d');
ctx.fillStyle = '#FFEABD'; ctx.fillRect(0,0,1,1);   // land placeholder
ctx.fillStyle = '#BEE8FF'; ctx.fillRect(1,0,1,1);   // ocean placeholder
// just dummy base—actual OSM layer will be tinted below

const osm = new TileLayer({
  source: new ol.source.OSM({
    crossOrigin:'anonymous',
  }),
  opacity: 0.7,
});

// --- graticule layer
let gridColor = '#000000', gridWidth = 1;
const graticule = new Graticule({
  strokeStyle: new Stroke({ color: gridColor, width: gridWidth }),
  showLabels: false,
  wrapX: true,
  intervals: [1,2,5,10,15,30,45,90]
});

// --- map
const map = new Map({
  target: 'map',
  layers: [osm, graticule],
  view: new View({
    center: fromLonLat([125, 13]),
    zoom: 5,
    projection: getProjection('EPSG:3857')
  })
});

// --- side coordinate labels
function updateSideLabels() {
  const view = map.getView();
  const extent = view.calculateExtent(map.getSize());
  const corners = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  const [minLon, minLat, maxLon, maxLat] = corners;

  // intervals roughly matching graticule
  const step = 5;
  const left = document.getElementById('leftLabels');
  const right = document.getElementById('rightLabels');
  const top = document.getElementById('topLabels');
  const bottom = document.getElementById('bottomLabels');
  [left,right,top,bottom].forEach(d => d.innerHTML='');

  for(let lat=Math.ceil(minLat/step)*step; lat<=maxLat; lat+=step){
    const label = fmtDeg(lat,true);
    [left,right].forEach(d=>{
      const span=document.createElement('div');
      span.textContent=label;
      span.className='coord-label';
      d.appendChild(span);
    });
  }
  for(let lon=Math.ceil(minLon/step)*step; lon<=maxLon; lon+=step){
    const label = fmtDeg(lon,false);
    [top,bottom].forEach(d=>{
      const span=document.createElement('div');
      span.textContent=label;
      span.className='coord-label';
      d.appendChild(span);
    });
  }
}
map.on('moveend', updateSideLabels);
updateSideLabels();

// --- color / width controls
function updateGrid() {
  gridColor = document.getElementById('gridColor').value;
  gridWidth = parseFloat(document.getElementById('gridWidth').value);
  graticule.setStrokeStyle(new Stroke({color:gridColor,width:gridWidth}));
  map.render();
}
['gridColor','gridWidth'].forEach(id=>{
  document.getElementById(id).addEventListener('input',updateGrid);
});

function tintMap(){
  document.body.style.backgroundColor=document.getElementById('oceanColor').value;
}
['landColor','oceanColor'].forEach(id=>{
  document.getElementById(id).addEventListener('input',tintMap);
});
tintMap();
