import 'https://cdn.jsdelivr.net/npm/ol@latest/ol.css';
import Map from 'https://cdn.jsdelivr.net/npm/ol@latest/Map.js';
import View from 'https://cdn.jsdelivr.net/npm/ol@latest/View.js';
import TileLayer from 'https://cdn.jsdelivr.net/npm/ol@latest/layer/Tile.js';
import OSM from 'https://cdn.jsdelivr.net/npm/ol@latest/source/OSM.js';
import Graticule from 'https://cdn.jsdelivr.net/npm/ol@latest/layer/Graticule.js';
import Stroke from 'https://cdn.jsdelivr.net/npm/ol@latest/style/Stroke.js';
import Style from 'https://cdn.jsdelivr.net/npm/ol@latest/style/Style.js';
import {fromLonLat} from 'https://cdn.jsdelivr.net/npm/ol@latest/proj.js';

// Base map layer
const base = new TileLayer({
  source: new OSM(),
  opacity: 0.5,
});

// Graticule (latitude/longitude lines)
const graticule = new Graticule({
  strokeStyle: new Stroke({
    color: '#000000',  // grid line color
    width: 1.0,        // grid line thickness
  }),
  showLabels: true,
  wrapX: true,
});

// Map object
const map = new Map({
  target: 'map',
  layers: [base, graticule],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
});
