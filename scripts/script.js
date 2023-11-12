var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/breezy69/clotdfxhp005h01rcdqly85qu/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJlZXp5NjkiLCJhIjoiY2xvaXlwMWxpMHB2cjJxcHFyeTMwNzk0NCJ9.R18DLRCA9p_SNX-6dtZZZg', {
  maxZoom: 20,
}).addTo(map);


var geojson;

function style(feature) {
  return {
    fillColor: '#000000',
    weight: 2,
    opacity: 1,
    color: '#FFFFFF',
    dashArray: '1',
    fillOpacity: 0.7
  };
}

fetch('https://cdn.glitch.me/c9945e78-f821-425c-9d77-93bc9fa13895/Military_Bases.geojson?v=1699317690487')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    geojson = L.geoJSON(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  });

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#808080', 
    dashArray: '',
    fillOpacity: 0.7
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this._div.style.color = 'black'; 
  this.update();
  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = '<h4>US Military Bases</h4>' + (props ?
    '<b>' + props.featureName + '</b><br />' + 'Is Joint Base: ' + props.isJointBase + '<br />' +
    'is Active: ' + props.siteOperationalStatus
    : '<span class="hover-text">Hover over a base</span>'); 
};

info.addTo(map);
