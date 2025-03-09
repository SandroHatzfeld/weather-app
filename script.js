const baseURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
const key = "9FZM8WUKPYLBQQUKHUB4XG7C9"
const contentType = "json"
// const elements = ${elements} "&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Chumidity%2Cprecip%2Cprecipprob%2Cprecipcover%2Cpreciptype%2Csnow%2Cwindspeed%2Cwinddir%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon"
const systems = [ "metric", "us" ]
const units = [
	{
		lengthSmall: "mm",
		length: "m",
		degree: "°C",
		speed: "km/h"
	},
	{
		lengthSmall: "inch",
		length: "ft",
		degree: "°F",
		speed: "mi/h"
	}
]
const dateOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// element selection
const app = document.querySelector("#app-container")
const unitSelection = document.querySelector("#unit-wrapper")
const adressInput = document.querySelector("#adress-input")
const adressInputSubmit = document.querySelector("#adress-input-submit")
const forecastWrapper = document.querySelector("#forecast-wrapper")

let userLocation = ""
let selectedUnit = 0
let data

// **************************************************
//  Prevent CSS transitions from firing on page load
// **************************************************
window.onload = () => {
	document.querySelector('body').classList.remove('preload')
}

// fetch the data depending on the location
async function getData() {
	try {
		//dynamically build the url for fetching
		const apiURL = `${baseURL}${userLocation}?unitGroup=${systems[ selectedUnit ]}&key=${key}&contentType=${contentType}`

		const response = await fetch(apiURL)
		return await response.json()
		
	} catch (err) {
		console.log(err)
	}
}

// helper function to change the location
function setLocation(location) {
	userLocation = location
}

// switch units on click
unitSelection.addEventListener("click", () => {
	if (selectedUnit === 0) {
		selectedUnit = 1
		unitSelection.dataset.unit = "1"
	} else {
		selectedUnit = 0
		unitSelection.dataset.unit = "0"
	}
	renderValuesToScreen()
})

// input listener for changing the city
adressInputSubmit.addEventListener("click", (e) => {
	e.preventDefault()
	if (adressInput.value === undefined || adressInput.value === "") return
	adressInputSubmit.parentElement.classList.remove("active")

	setLocation(adressInput.value)
	renderLoadingValues()
})
adressInput.addEventListener("input", (e) => {
	if (adressInput.value === undefined || adressInput.value === "") {
		adressInputSubmit.parentElement.classList.remove("active")
	} else {
		adressInputSubmit.parentElement.classList.add("active")
	}
})

if(adressInput.value !== "") {
	adressInputSubmit.parentElement.classList.add("active")
}

// replace the placeholder values with actuals ones
function renderValuesToScreen() {
	const currentConditions = data.currentConditions
	const forecast = data.days
	
	console.log(forecast)
	
	// data for adress
	const splitAdress = data.resolvedAddress.split(",")
	const correctedAdress = `${splitAdress[1]}, ${splitAdress[2] ? splitAdress[2] : ""}`

	adressInput.value = splitAdress[0]
	$("#adress-value").text(correctedAdress)
	const date = new Date()
	$("#date-value").text(date.toLocaleDateString(undefined, dateOptions))

	setInterval(() => {	
		const date = new Date()
		$("#time-value").text(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
	}, 1000);

	// data for sunrise/sunset
	$("#sunrise-value").text(currentConditions.sunrise)
	$("#sunset-value").text(currentConditions.sunset)
	
	// data for current weather
	$("#current-weather-icon").attr("src",`./assets/images/weather_icons/${currentConditions.icon}.svg`)
	$("#current-weather-value").text(currentConditions.conditions)
	$("#current-temperature-value").html(`${currentConditions.temp}&nbsp;${units[ selectedUnit ].degree}`)
	$("#current-min-temp-value").html(`${forecast[0].tempmin}&nbsp;${units[ selectedUnit ].degree}`)
	$("#current-max-temp-value").html(`${forecast[0].tempmax}&nbsp;${units[ selectedUnit ].degree}`)

	// data for wind
	$("#wind-rose-needle").css("rotate", `${currentConditions.winddir}deg`)
	$("#wind-speed-value").text(currentConditions.windspeed)
	$("#wind-speed-unit").text(units[ selectedUnit ].speed)
	$("#wind-speed-direction").text(translateWindDir(currentConditions.winddir))

	// data for rain
	$("#rain-chance-value").html(`${currentConditions.precipprob}&nbsp;%`)
	$("#rain-coverage-value").html(`${currentConditions.precip}&nbsp;${units[ selectedUnit ].lengthSmall}`)
	$("#humidity-value").html(`${currentConditions.humidity}&nbsp;%`)

	// render forecast
	forecast.forEach(day => {
		const dayItem = document.createElement("div")
		dayItem.classList.add("day-item")
		dayItem.classList.add("col-container")
		dayItem.innerHTML = dayElement(day)

		forecastWrapper.appendChild(dayItem)

	});
}

// render loading values 
async function renderLoadingValues() {
	app.classList.remove("empty")
	app.classList.add("loading")

	data = await getData()
	renderValuesToScreen()
	app.classList.remove("loading")
}


// translate the angles to readable text
function translateWindDir(angle) {
	const directions = [
		"North", "North North East", "North East", "East North East", 
		"East", "East South East", "South East", "South South East", 
		"South", "South South West", "South West", "West South West", 
		"West", "West North West", "North West", "North North West"
	];
	const index = Math.round(angle / 22.5) % 16;
	return directions[index];
}


function dayElement(day) {
	
	return `
		<img src="./assets/images/weather_icons/${day.icon}.svg" alt="" class="day-icon">
		<div class="day-bar-container">
			<div class="day-rain-amount" data-rain-amount="${day.precipprob}"></div>
			<div class="day-temperature" data-temp="${day.temp}"></div>
		</div>
		<div class="day-data">
			<p class="day-temp">${day.tempmin}&nbsp;${units[ selectedUnit ].degree} / ${day.tempmax}&nbsp;${units[ selectedUnit ].degree}</p>
			<p class="day-name"></p>
		</div>
	`
}