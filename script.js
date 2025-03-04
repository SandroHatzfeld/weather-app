const baseURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"
const key = "9FZM8WUKPYLBQQUKHUB4XG7C9"
const contentType = "json"
let userLocation = "Primasens"
let unit = "metric"

async function getData() {
	try {
		const apiURL = `${baseURL}${userLocation}?unitGroup=${unit}&key=${key}&contentType=${contentType}`
		console.log(apiURL);
		
		const response = await fetch(apiURL)
		const responsData = await response.json()
		console.log(responsData);
		
	} catch (err) {
		console.log(err);
		
	}
}

getData()