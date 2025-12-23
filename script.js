const map=L.map('map').setView([-3.2,104.3],7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);

const colors=["#1abc9c","#3498db","#9b59b6","#e74c3c","#f1c40f","#2ecc71","#e67e22"];
let idx=0;const legendItems={};let kabLayer;

function style(f){
 if(!legendItems[f.properties.kabupaten]) legendItems[f.properties.kabupaten]=colors[idx++%colors.length];
 return{fillColor:legendItems[f.properties.kabupaten],weight:1,color:'white',fillOpacity:0.7};
}

fetch('data/sumsel_kabupaten.geojson').then(r=>r.json()).then(d=>{
 kabLayer=L.geoJSON(d,{style,onEachFeature:(f,l)=>l.bindPopup(f.properties.kabupaten)}).addTo(map);
 new L.Control.Search({layer:kabLayer,propertyName:'kabupaten',marker:false}).addTo(map);
 const legend=L.control({position:'bottomright'});
 legend.onAdd=function(){
  const div=L.DomUtil.create('div','legend');div.innerHTML='<b>Kab/Kota</b><br>';
  for(let k in legendItems) div.innerHTML+=`<i style="background:${legendItems[k]}"></i>${k}<br>`;
  return div;
 };
 legend.addTo(map);
});

fetch('data/ibukota_sumsel.geojson').then(r=>r.json()).then(d=>{
 L.geoJSON(d,{pointToLayer:(f,ll)=>L.marker(ll).bindPopup(f.properties.nama)}).addTo(map);
});