// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/asianhate2.csv";
let markers = L.featureGroup();
let jsondata;

let la_bounds = [
	[34.37540468090968, -117.91621685028078],
	[33.650292870379424, -118.8404417037964],
];

let filters = [
	{
		title: "All victims",
		code1: -1,
		code2: -1,
	},
	{
		title: "0 - 19 year old victims",
		code1: 0,
		code2: 19,
	},
	{
		title: "20 - 39 year old victims",
		code1: 20,
		code2: 39,
	},
	{
		title: "40 - 59 year old victims",
		code1: 40,
		code2: 59,
	},
	{
		title: "60 - 79 year old victims",
		code1: 60,
		code2: 79,
	},
	{
		title: "Other Super Old people",
		code1: 80,
		code2: 99,
	},
];

// initialize
$(document).ready(function () {
	createMap(lat, lon, zl);
	getJSON();
	createSidebar();
});

// create the map
function createMap(lat, lon, zl) {
	map = L.map("map").setView([lat, lon], zl);

	// custom basemap authored in mapbox studio
	// L.tileLayer(
	// 	"https://api.mapbox.com/styles/v1/yohman/ckonilpb708eb19oadf970pr8/tiles/256/{z}/{x}/{y}@2x?access_token=pk.pk.eyJ1IjoiaXZhbm1hOSIsImEiOiJja290Ymd6OXUwOGYwMzJycjdzZHUwM2FjIn0.eCh0HqQiDnmHYWAZRIgLTQ.u2xRJMiChx914U7mOZMiZw",

	// 	// mapbox basemaps
	const accessToken =
		"pk.eyJ1IjoiaXZhbm1hOSIsImEiOiJja290Ymd6OXUwOGYwMzJycjdzZHUwM2FjIn0.eCh0HqQiDnmHYWAZRIgLTQ";
	L.tileLayer(
		"https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=" +
			accessToken,
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: "streets-v11",
			tileSize: 512,
			zoomOffset: -1,
		}
	).addTo(map);

	map.fitBounds(la_bounds);
}

function getJSON() {
	$.getJSON(
		"https://data.lacity.org/resource/2nrs-mtv8.json?$order=date_rptd%20desc",
		function (data) {
			console.log(data);
			jsondata = data;
			mapJSON();
		}
	);
}

function mapJSON(age1, age2) {
	ageLow = parseInt(age1);
	ageHigh = parseInt(age2);

	// clear markers if they are on the map
	markers.clearLayers();

	// marker/circle options
	circleOptions = {
		weight: 1,
		color: "white",
		fillColor: "red",
		radius: 5,
		fillOpacity: 1,
	};

	// here is the filter!
	if (age2 != -1) {
		console.log("filtering...");
		filtered_data = jsondata.filter(
			(item) => item.vict_age >= ageLow && item.vict_age < ageHigh
		);
	} else {
		console.log("map every");
		// there is no filter, so just map everything
		filtered_data = jsondata;
	}
	console.log(filtered_data);

	// draw markers on the filtered data
	filtered_data.forEach(function (item, index) {
		// // different color for each major race category
		// if(item.vict_descent==='H'){
		// 	circleOptions.fillColor = 'green'
		// }
		// else if (item.vict_descent==='W'){
		// 	circleOptions.fillColor = 'blue'
		// }
		// else if (item.vict_descent==='B'){
		// 	circleOptions.fillColor = 'red'
		// }
		// else if (item.vict_descent==='A'){
		// 	circleOptions.fillColor = 'orange'
		// }
		// else if (item.vict_descent==='O'){
		// 	circleOptions.fillColor = 'yellow'
		// }
		if (age2 !== null) {
			circleOptions.fillColor =
				"#" + (155).toString(16) + (age2 * 3).toString(16) + (102).toString(16);
		} else {
			circle.options.fillColor = "blue";
		}
		if (item.lat != "0") {
			let marker = L.circleMarker([item.lat, item.lon], circleOptions).on(
				"mouseover",
				function () {
					let victimAge;
					let victimRace;
					let victimGender;
					if (item.vict_age) {
						victimAge =
							"<span class='highlighted-text'>" +
							item.vict_age +
							"</span> year old";
					} else {
						victimAge = "";
					}
					if (item.vict_descent) {
						victimRace =
							"of race <span class='highlighted-text'>" +
							item.vict_descent +
							"</span>";
					} else {
						victimRace = "";
					}
					if (item.vict_sex) {
						victimGender =
							"of gender <span class='highlighted-text'>" +
							item.vict_sex +
							"</span>";
					} else {
						victimGender = "";
					}
					$(".footer").html(
						`Victim of <span class='highlighted-text'>${item.crm_cd_desc}</span> is a ${victimAge} ${victimRace} ${victimGender}`
					);
				}
			);
			markers.addLayer(marker);
		}
	});
	markers.addTo(map);
}

function createSidebar() {
	// Add description text
	$(".sidebar").append(`
	<p>
		Showing the last 1000 crime incidents reported by the LAPD
	</p>
	`);

	// add sidebar buttons
	filters.forEach(function (item) {
		$(".sidebar").append(`
			<div class="sidebar-item" onclick="mapJSON('${item.code1}', '${item.code2}')">${item.title}</div>
		`);
	});
}
