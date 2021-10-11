let weatherContainer = document.getElementById("weather-container");
let fivecastContainer = document.getElementById("fivecast-container");
let fivecastRow = document.createElement('div');
		fivecastRow.setAttribute("class", "row g-0 justify-content-between");
let fivecastTitle = document.createElement('h2');
		fivecastTitle.textContent = "";
let searchList = document.getElementById("search-history");
let searchItems = searchList.getElementsByTagName("li");
let submitButton = document.getElementById("submit-btn");
let APIkey = "442a360c733830bd6ebab1fdd4d285ad";
let city, lat, lon;

function convertCity(e) {
	e.preventDefault();
	let city = document.getElementById("city-search").value;
	let cityConversion = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIkey;

	fetch(cityConversion)
		.then(function (response) {
			return response.json();
		})
			.then(function (coorData) {
				console.log(coorData);
				let lat = coorData[0].lat;
				let lon = coorData[0].lon;
				let coordName = coorData[0].name;
				localStorage.setItem("coordName", JSON.stringify(coordName));
				getApi(lat, lon);
			});
}

function getApi(lat, lon) {
	let requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + APIkey;

	fetch(requestUrl)
		.then(function (response) {
			return response.json();
		})
			.then(function (weatherData) {
				console.log(weatherData);

				function searcHistory() {
					let city = document.getElementById("city-search").value;
					let citySearch = city;
					citySearch = citySearch[0].toUpperCase() + citySearch.slice(1);
					localStorage.setItem("citySearch", JSON.stringify(citySearch));
				}

				function showHistory() {
					let lastSearch = JSON.parse(localStorage.getItem("coordName"));
					if (lastSearch !== null) {
						let li = document.createElement('li');
						li.setAttribute("class", "search-result");
						li.textContent = lastSearch;
						li.addEventListener("click", reSearch);
						searchList.prepend(li);
					}
				}

				function reSearch() {
					console.log("Search History Li Clicked");
					let historyTxt = this.textContent;
					console.log(historyTxt);
					cityConversion = "http://api.openweathermap.org/geo/1.0/direct?q=" + historyTxt + "&limit=1&appid=" + APIkey;

					fetch(cityConversion)
						.then(function (response) {
							return response.json();
						})
							.then(function (coorData) {
								console.log(coorData);
								let lat = coorData[0].lat;
								let lon = coorData[0].lon;
								let coordName = coorData[0].name;
								localStorage.setItem("coordName", JSON.stringify(coordName));
								getApi(lat, lon);
							});
				}

				function convertDate(unixTS) {
					let milli = unixTS * 1000;
					let dateObject = new Date(milli);
					let dateStr = dateObject.toLocaleString();
					let result = dateStr.split(",", 1);
					return result;
				}

				function currentWeather() {
					let cWeather = document.createElement('div');
					let cityName = document.createElement('h2');
					let cityTS = weatherData.current.dt;
					let currentDt = convertDate(cityTS);
					let cityIcon = document.createElement('img');
					let cityTemp = document.createElement('div');
					let cityWind = document.createElement('div');
					let cityHumid = document.createElement('div');
					let cityUV = document.createElement('div');

					cityName.textContent = JSON.parse(localStorage.getItem("coordName")) + " " + currentDt;
					iconCode = weatherData.current.weather[0].icon;
					iconSrc = "http://openweathermap.org/img/wn/" + iconCode + ".png";
					cityIcon.setAttribute("src", iconSrc);
					cityTemp.textContent = "Temp: " + weatherData.current.temp + "°C but feels like " + weatherData.current.feels_like + "°C";
					cityWind.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
					cityHumid.textContent = "Humidity: " + weatherData.current.humidity + "%";
					cityUV.textContent = "UV Index: " + weatherData.current.uvi;

					if ((weatherData.current.uvi >= 0) && (weatherData.current.uvi <= 2)) {
						cityUV.setAttribute("class", "uv-green");
					} else if ((weatherData.current.uvi >= 3) && (weatherData.current.uvi <= 5)) {
						cityUV.setAttribute("class", "uv-yellow");
					} else if ((weatherData.current.uvi >= 6) && (weatherData.current.uvi <= 7)) {
						cityUV.setAttribute("class", "uv-orange");
					} else if ((weatherData.current.uvi >= 8) && (weatherData.current.uvi <= 10)) {
						cityUV.setAttribute("class", "uv-red");
					} else if (weatherData.current.uvi >= 11) {
						cityUV.setAttribute("class", "uv-violet");
					}
					
					cWeather.append(cityName, cityIcon, cityTemp, cityWind, cityHumid, cityUV);

					if (weatherContainer.firstChild === null) {
						weatherContainer.appendChild(cWeather);
					} else {
						weatherContainer.replaceChild(cWeather, weatherContainer.childNodes[0]);
					}
				}

				function fivecast() {
					fivecastRow.innerHTML = "";
					fivecastTitle.textContent = "5-Day Forecast:";
					let parentDiv = fivecastContainer.parentNode;
							parentDiv.insertBefore(fivecastTitle, fivecastContainer);

					for (let i = 1; i < 6; i++) {
						let fivecastCard = document.createElement('div');
								fivecastCard.setAttribute("class", "col-12 col-md-2 bg-dark text-light fivecast");
						let fivecastDate = document.createElement('h4');
						let fivecastTS = weatherData.daily[i].dt;
						let fivecastDt = convertDate(fivecastTS);
						let fivecastIcon = document.createElement('img');
						let fivecastTemp = document.createElement('div');
						let fivecastWind = document.createElement('div');
						let fivecastHumid = document.createElement('div');

						fivecastDate.textContent = fivecastDt;
						ficonCode = weatherData.daily[i].weather[0].icon;
						ficonSrc = "http://openweathermap.org/img/wn/" + ficonCode + ".png";
						fivecastIcon.setAttribute("src", ficonSrc);
						fivecastTemp.textContent = "Temp: " + weatherData.daily[i].temp.day + "°C";
						fivecastWind.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
						fivecastHumid.textContent = "Humidity: " + weatherData.daily[i].humidity + "%";

						fivecastCard.append(fivecastDate, fivecastIcon, fivecastTemp, fivecastWind, fivecastHumid);
						fivecastRow.append(fivecastCard);
					}

						if (fivecastContainer.firstChild === null) {
							fivecastContainer.append(fivecastRow);
						} else {
							fivecastContainer.replaceChild(fivecastRow, fivecastContainer.childNodes[0]);
						}
				}

				searcHistory();
				showHistory();
				currentWeather();
				fivecast();
				
			});
}

submitButton.addEventListener("click", convertCity);
