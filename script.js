
const map = L.map('map').setView([-3.2, 104.3], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap contributors'
}).addTo(map);

// warna choropleth
function getColor(d){
 return d > 1500 ? '#800026' :
        d > 1000 ? '#BD0026' :
        d > 700  ? '#E31A1C' :
        d > 400  ? '#FC4E2A' :
        d > 200  ? '#FD8D3C' :
                   '#FEB24C';
}

function style(feature){
 return {
  fillColor: getColor(feature.properties.kepadatan),
  weight: 1,
  color: 'white',
  fillOpacity: 0.7
 };
}

// layer polygon
fetch('data/sumsel_populasi.geojson')
.then(res => res.json())
.then(data => {
 L.geoJSON(data, {
  style: style,
  onEachFeature: (f, layer) => {
   layer.bindPopup(
    `<b>${f.properties.kabupaten}</b><br>
     Kepadatan: ${f.properties.kepadatan} jiwa/km²`
   );
  }
 }).addTo(map);
});

// MARKER ibukota / titik wilayah
fetch('data/marker_sumsel.geojson')
.then(res => res.json())
.then(data => {
 L.geoJSON(data, {
  pointToLayer: (f, latlng) =>
   L.marker(latlng).bindPopup(
    `<b>${f.properties.nama}</b><br>
     Kepadatan: ${f.properties.kepadatan} jiwa/km²`
   )
 }).addTo(map);
});

// legend
const legend = L.control({position:'bottomright'});
legend.onAdd = function(){
 const div = L.DomUtil.create('div','legend');
 div.innerHTML =
 '<b>Kepadatan Penduduk</b><br>' +
 '<i style="background:#800026"></i>>1500<br>' +
 '<i style="background:#BD0026"></i>1000–1500<br>' +
 '<i style="background:#E31A1C"></i>700–1000<br>' +
 '<i style="background:#FC4E2A"></i>400–700<br>' +
 '<i style="background:#FD8D3C"></i>200–400<br>' +
 '<i style="background:#FEB24C"></i><200';
 return div;
};
legend.addTo(map);
