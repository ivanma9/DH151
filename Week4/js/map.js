// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = {
	twitterLocations: "data/10_million_location.csv",
	twitterUsers: "data/10_million_user.csv",
	2015: "data/2015.csv",
	2016: "data/2016.csv",
	2017: "data/2017.csv",
	2018: "data/2018.csv",
	2019: "data/2019.csv",
};
let markers = L.featureGroup();
// initialize
$(document).ready(function () {
	createMap(lat, lon, zl);
	readCSV(path.twitterLocations);
});

// create the map
function createMap(lat, lon, zl) {
	map = L.map("map").setView([lat, lon], zl);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
}

// function to read csv data
function readCSV(path) {
	let i = 0;
	Papa.parse(path, {
		header: true,
		download: true,
		step: function(row, parser){
			if(i > 0) // low row value
			{
				mapCSV(row);
			}
			i++;
			//console.log(i + " : " + row.data.latitude + " , " + row.data.longitude);
			if (i == 3000) //max row value
			{
				console.log("Parser STOP at " + i + "/100");
				parser.abort();
			}
		},

		complete: function (data) {
			//console.log(data);

			// map the data
			//mapCSV(data);
			console.log("Completed");
			console.log(markers);
			// add featuregroup to map
			markers.addTo(map);

			// fit map to markers
			map.fitBounds(markers.getBounds());
		},
	});
}

function mapCSV(row) {
	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: "white",
		fillColor: "dodgerblue",
		fillOpacity: 1,
	};

	// loop through each entry
	let item = row.data;
		// create a marker
		let marker = L.circleMarker(
			[item.latitude, item.longitude],
			circleOptions);
		// .on("mouseover", function () {
		// 	this.bindPopup(
		// 		`${item.title}<br><img src="${item.thumbnail_url}">`
		// 	).openPopup();
		//});

		// add marker to featuregroup
		markers.addLayer(marker);

		// // add entry to sidebar
		// $(".sidebar").append(
		// 	`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`
		// );


}



// function panToImage(index) {
// 	map.setZoom(17);
// 	map.panTo(markers.getLayers()[index]._latlng);
// }
