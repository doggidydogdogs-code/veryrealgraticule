import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import Graticule from 'ol/layer/Graticule.js';
import { Stroke, Fill, Style, Text } from 'ol/style.js';
import { get as getProjection } from 'ol/proj.js';

// Helper: format coordinate like "14°30'N"
function formatCoord(value, isLat) {
  const hemisphere = isLat
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutes = Math.floor((abs - degrees) * 60);
  return `${degrees}°${minutes.toString().padStart(2, '0')}'${hemisphere}`;
}

// Create the map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      // Clean basemap (lighter)
      source: new OSM({
        attributions: '',
      })
    }),
    // Add graticule
    new Graticule({
      strokeStyle: new Stroke({
        color: 'rgba(0,0,0,0.4)',
        width: 1,
      }),
      showLabels: true,
      lonLabelFormatter: (lon) => formatCoord(lon, false),
      latLabelFormatter: (lat) => formatCoord(lat, true),
      lonLabelPosition: 0.98, // near right edge
      latLabelPosition: 0.02, // near bottom
      lonLabelStyle: new Style({
        text: new Text({
          font: '12px "Segoe UI", sans-serif',
          fill: new Fill({ color: '#000' }),
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.6)' }),
          padding: [2, 4, 2, 4],
        }),
      }),
      latLabelStyle: new Style({
        text: new Text({
          font: '12px "Segoe UI", sans-serif',
          fill: new Fill({ color: '#000' }),
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.6)' }),
          padding: [2, 4, 2, 4],
        }),
      }),
      wrapX: true,
      intervals: [1, 2, 5, 10, 15, 30, 45, 90], // adjust density by zoom
    })
  ],
  view: new View({
    center: [13400000, 1500000], // roughly near the Philippines
    zoom: 4,
    projection: getProjection('EPSG:3857')
  })
});
