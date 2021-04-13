let data = [
	{
		title: "Din Tai Fung",
		description: "A dumpling house that specializes in Xiao Long Bao",
		lat: 33.6917,
		lon: -117.8881,
		url:
			"https://dynaimage.cdn.cnn.com/cnn/q_auto,w_900,c_fill,g_auto,h_506,ar_16:9/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F181213162542-xiao-long-bao---courtesy-ding-tai-fung.jpg",
	},
	{
		title: "Howlin' Ray's",
		description: "Literally fire chicken",
		lat: 34.0615,
		lon: -118.24,
		url:
			"https://scontent-lax3-1.xx.fbcdn.net/v/t1.18169-9/27971892_1020172884827147_8779453500777389462_n.jpg?_nc_cat=101&ccb=1-3&_nc_sid=e3f864&_nc_ohc=3m9s9pFYQ0gAX95LPOB&_nc_ht=scontent-lax3-1.xx&oh=9a4881db633c5b67dfd2b250d4a5525e&oe=609209E0",
	},
	{
		title: "Sedona",
		description: "Radiator springs vibes with the red rocks",
		lat: 34.8697,
		lon: -111.761,
		url:
			"https://canyonvilla.com/wp-content/uploads/2017/10/sm_slides_8-640x475.jpg",
	},
	{
		title: "Etihad Stadium",
		description: "Manchester City football stadium",
		lat: 53.4831,
		lon: -2.2004,
		url:
			"https://www.thestadiumbusiness.com/wp-content/uploads/2021/03/EtihadStadiumCrop.jpg",
	},
	{
		title: "Multnomah Falls",
		description:
			"A gorgeous waterfall along the Columbia Gorge on the border of Washington and Oregon",
		lat: 45.5762,
		lon: -122.1158,
		url:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Multnomah_Falls_on_2_August_2012.jpg/250px-Multnomah_Falls_on_2_August_2012.jpg",
	},
];

var map = L.map("map").setView([51.505, -0.09], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//feature group
let myMarkers = L.featureGroup();

//loop thru data
data.forEach(function (item, index) {
	let popup = L.popup().setContent(
		`<h2>${item.title}
		</h2> ${item.description}
		<br /> <br /> <img src =' ${item.url}
	    ' width=80% />`
	);
	let marker = L.marker([item.lat, item.lon]).bindPopup(popup).openPopup();
	myMarkers.addLayer(marker);

	$(".sidebar").append(
		`<div class ="sidebar-item" onclick="flyToIndex(${index})">
			${item.title}
			<span class="extra">
				${item.description}
			</span>
		</div>`
	);
});

myMarkers.addTo(map);

// define layers
let layers = {
	"My Markers": myMarkers,
};

// add layer control box
L.control.layers(null, layers).addTo(map);
map.fitBounds(myMarkers.getBounds()); // bounds of markers for map

let ul = document.getElementById("nav");
if (!ul) console.log("err");
// data.forEach(renderList);

function flyToIndex(index) {
	map.flyTo([data[index].lat, data[index].lon], 12);
	myMarkers.getLayers()[index].openPopup();
}

// function renderList(elem, ind, arr) {
// 	let li = document.createElement("li");
// 	li.setAttribute("class", "item");

// 	let heading = document.createElement("h3");
// 	let desc = document.createElement("p");
// 	desc.setAttribute("class", "desc");
// 	heading.innerHTML = elem.title;
// 	desc.innerHTML = elem.description;
// 	li.appendChild(heading);
// 	li.appendChild(desc);

// 	ul.appendChild(li);
// }
