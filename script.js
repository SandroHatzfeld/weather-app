const baseURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
const key = "9FZM8WUKPYLBQQUKHUB4XG7C9"
const contentType = "json"
const elements = "&elements=datetime%2CdatetimeEpoch%2Cname%2Caddress%2CresolvedAddress%2Clatitude%2Clongitude%2Ctempmax%2Ctempmin%2Ctemp%2Chumidity%2Cprecip%2Cprecipprob%2Cprecipcover%2Cpreciptype%2Csnow%2Cwindspeed%2Cwinddir%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cconditions%2Cdescription%2Cicon"

// element selection
const locationInput = document.querySelector("#adressInput")
const locationInputSubmit = document.querySelector("#submitAdressInput")
const unitSelection = document.getElementsByName("unit")
const currentWeatherEl = document.querySelector("#currentWeather")
const forecastWeatherEl = document.querySelector("#forecastWeather")


let userLocation = "Pirmasens"
let unit = "metric"


// fetch the data depending on the location
async function getData() {
	try {
		//dynamically build the url for fetching
		const apiURL = `${baseURL}${userLocation}?unitGroup=${unit}${elements}&key=${key}&contentType=${contentType}`
		
		const response = await fetch(apiURL)
		const responsData = await response.json()

	} catch (err) {
		console.log(err);
	}
}

// helper function to change the location
function setLocation(location) {
	if(location === undefined || location === "") return
	userLocation = location	
}

// eventlistener for submitting new location
locationInputSubmit.addEventListener("click", (e) => {
	e.preventDefault()
	setLocation(locationInput.value)
	getData()
})

// eventlistener for unit selection
unitSelection.forEach(radioBtn => {
	radioBtn.addEventListener("click", (e) => {
		unit = e.target.value		
	})
})
