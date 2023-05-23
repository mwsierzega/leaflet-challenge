// Store our API endpoint as queryUrl - Past 7 Days all earthquakes
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map centered around the United States
let map = L.map('map').setView([37, -120], 3);

// Create the tile layer that will be the background of our map
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add our streetmap tile layer to the map.
streetmap.addTo(map);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Give feature a popup function that describes the magnitude and depth of the earthquake.
    data.features.forEach(function (feature) {
        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        // Describe marker attributes
        let markerOptions = {
            radius: magnitude * 5,
            fillColor: getColor(depth),
            color: '#FFF',
            weight: .7,
            opacity: 1,
            fillOpacity: 0.7
          };
          // Create the marker and add it to the map
          L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions)
            .addTo(map)
            .bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth);
    });
   

});

// Define funtion getColor, assign color code for each range
function getColor(depth) {
    let colors = ['#FFFFCC', '#FFCCCC', '#FF99CC', '#FF33CC', '#CC33CC', '#9900CC'];
    let depthRanges = [-10, 10, 30, 50, 70, 90, 110];
    // Create for loop to run through depth ranges and assign colors
    for (let i = 0; i < depthRanges.length; i++) {
      if (depth < depthRanges[i]) {
        return colors[i];
      }
    }
    return colors[colors.length - 1];
  }
  
// Create a legend
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend');
  let depthRange = [-10, 10, 30, 50, 70, 90, 110];
  let labels = [];

  //loop through deoth range intervals and generate a label with a colored square for each interval
  div.innerHTML += '<h4>Depth</h4>';
  for (let i = 1; i < depthRange.length; i++) {
    let color = getColor(depthRange[i]);
    let prevColor = getColor(depthRange[i - 1]);
    let rangeLabel = depthRange[i - 1] + ' - ' + depthRange[i];
    if(depthRange[i - 1] == 90){
      labels.push('<i style="width: 10px;height: 10px;display: inline-block;background:' + color + '"></i> ' + rangeLabel);
    }else {
      labels.push('<i style="width: 10px;height: 10px;display: inline-block;background:' + prevColor + '"></i> ' + rangeLabel);
      }
  }
  div.innerHTML += labels.join('<br>');

  return div;
};
legend.addTo(map);