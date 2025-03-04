const baseURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
const key = "9FZM8WUKPYLBQQUKHUB4XG7C9"
const contentType = "json"

const locationInput = document.querySelector("#adressInput")
const locationInputSubmit = document.querySelector("#submitAdressInput")
const unitSelection = document.getElementsByName("unit")

let userLocation = "Primasens"
let unit = "metric"

async function getData() {
	try {
		const apiURL = `${baseURL}${userLocation}?unitGroup=${unit}&key=${key}&contentType=${contentType}`
		
		const response = await fetch(apiURL)
		const responsData = await response.json()
		console.log(responsData);
		
	} catch (err) {
		console.log(err);
	}
}

function setLocation(location) {
	if(location === undefined || location === "") return
	userLocation = location	
}

locationInputSubmit.addEventListener("click", (e) => {
	e.preventDefault()
	setLocation(locationInput.value)
	getData()
})

unitSelection.forEach(radioBtn => {
	radioBtn.addEventListener("click", (e) => {
		unit = e.target.value		
	})
})
getData()