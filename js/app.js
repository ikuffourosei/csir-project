var map = L.map("map", {
	center: [7.9465, -1.0232],
	zoom: 7,
});

let basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//google Streets
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
	maxZoom: 20,
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleStreets.addTo(map)

googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
	maxZoom: 20,
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleHybrid.addTo(map)

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	maxZoom: 20,
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
googleSat.addTo(map)

var spotdata = L.markerClusterGroup({showCoverageOnHover: true});
var accidentsIcon = L.icon({iconUrl: 'assets/accident32-1.png'});

let accidentEvents = L.geoJSON(accdata, {
	onEachFeature: function(feature, layer) {
		//layer.bindPopup(feature.geometry.coordinates);
		layer.bindPopup(`
                   <h2>Accident</h2>
                    <div >
                        <b>distance (km):</b> ${feature.properties.D__km_post} <br/>
                        <b>Latitude:</b> ${getDMS(feature.geometry.coordinates[1], 'lat')}<br/>
                        <b>Longitude:</b>${getDMS(feature.geometry.coordinates[0], 'lon')}
                    </div>
				`)
		layer.setIcon(accidentsIcon);
	},
	style: {
		color: "blue",
		weight: 0.7,
		fill: true,
		fillColor: "blue",
		fillOpacity: 0.4
	}
});



spotdata.addLayer(accidentEvents);
map.addLayer(spotdata);

var roadlayer = L.geoJSON(roadsdata, {
	style: {
		color: "black",
		weight: 0.7,
		opacity: 0.9
	}
});
roadlayer.addTo(map)

var regionlayers = L.geoJSON(regionsdata, {
	style: {
		color: "red",
		weight: 0.7,
		fill: true,
		fillColor: "green",
		fillOpacity: 0.1,
	},
	onEachFeature: onEachPolygon
});

function onEachPolygon(feature, layer) {
	let title = feature.properties.Name;
	layer.bindPopup(title)
}

regionlayers.addTo(map)


// search feature //

let accandroad = L.layerGroup([spotdata, regionlayers])
accandroad.addTo(map);

let searchControl = new L.Control.Search({
    layer: accandroad,
    propertyName: ['D__km_post', 'Name'],
    marker: false,
	autoCollapse: true, // Enable search as you type option
    moveToLocation: function(latlng, tile, map) {
        map.fitBounds( latlng.layer.getBounds() );
        const zoom = map.getBoundsZoom(latlng.layer.getBounds());
        map.setView(latlng, 20); // access the zoom
        setTimeout(function() {
            latlng.layer.openPopup();
        }, 1000)
    }
});

searchControl.on('search:locationfound', function(e) {
    if(e.layer._popup) {
        e.layer.openPopup();
    }
});
//searchControl.on('search:locationfound', function(e) {
//	e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
//	if(e.layer._popup) {
//		e.layer.openPopup();
//	}
//})
//    .on('search:collapsed', function(e) {
//	featuresLayer.eachLayer(function(layer) {	//restore feature color
//		featuresLayer.resetStyle(layer);
//	});
//});

map.addControl(searchControl);  //inizialize search control

function getDMS(dd, type) {
    let dir = dd > 0 ? (type === 'lat' ? 'N' : 'E') : (type === 'lat' ? 'S' : 'W');
    let absdd = Math.abs(dd);
    let deg = Math.floor(absdd);
    let min = Math.floor((absdd - deg) * 60);
    let sec = Math.round((absdd - deg - min / 60) * 3600 * 100) / 100;
    return `${deg}° ${min}' ${sec}" ${dir}`;
}


//Layer Controller//

var BaseLayers = {
	"OSM": basemap,
	"Google streets": googleStreets,
	"Hybrid": googleHybrid,
	"Google Sat": googleSat
};

var OverLayers = {
	"Regions": regionlayers,
	"Roads": roadlayer,
	"Accident data": spotdata
};

L.control.layers(BaseLayers, OverLayers).addTo(map);
L.control.locate().addTo(map);
L.Control.geocoder().addTo(map);
