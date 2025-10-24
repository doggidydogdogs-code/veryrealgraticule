import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import Graticule from 'ol/layer/Graticule.js';
import { Stroke, Fill, Style, Text } from 'ol/style.js';
import { get as getProjection } from 'ol/proj.js';

// Format like 14°30'N 125°15'E
function formatCoord(value, isLat) {
  const hemisphere = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutes = Math.floor((abs - degrees) * 60);
  return `${degrees}°${minutes.toString().padStart(2, '0')}'${hemisphere}`;
}

let graticuleColor = '#333333';
let graticuleWidth = 1;

// Base map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({ source: new OSM() })
  ],
  view: new View({
    center: [13400000, 1500000],
    zoom: 4,
    projection: getProjection('EPSG:3857')
  })
});

// Add graticule
const graticule = new Graticule({
  strokeStyle: new Stroke({ color: graticuleColor, width: graticuleWidth }),
  showLabels: true,
  lonLabelFormatter: (lon) => formatCoord(lon, false),
  latLabelFormatter: (lat) => formatCoord(lat, true),
  lonLabelPosition: 0.98,
  latLabelPosition: 0.02,
  lonLabelStyle: new Style({
    text: new Text({
      font: '12px Segoe UI',
      fill: new Fill({ color: '#000' }),
      backgroundFill: new Fill({ color: 'rgba(255,255,255,0.7)' }),
      padding: [2,4,2,4],
    })
  }),
  latLabelStyle: new Style({
    text: new Text({
      font: '12px Segoe UI',
      fill: new Fill({ color: '#000' }),
      backgroundFill: new Fill({ color: 'rgba(255,255,255,0.7)' }),
      padding: [2,4,2,4],
    })
  }),
  wrapX: true,
});
map.addLayer(graticule);

// Control updates
document.getElementById('graticuleColor').addEventListener('input', (e) => {
  graticule.strokeStyle_ = new Stroke({ color: e.target.value, width: graticuleWidth });
  map.render();
});

document.getElementById('graticuleWidth').addEventListener('input', (e) => {
  graticuleWidth = parseFloat(e.target.value);
  graticule.strokeStyle_ = new Stroke({ color: graticuleColor, width: graticuleWidth });
  map.render();
});
