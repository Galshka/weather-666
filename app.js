let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let apiKey = "05bfb21a258cdae24d749dd944debfc2";

function getCurrentDate(date) {
  let now = new Date(date * 1000);
  let dayNumber = now.getDay();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (String(hours).length === 1) {
    hours = `0${hours}`;
  }
  if (String(minutes).length === 1) {
    minutes = `0${minutes}`;
  }

  let dayWeek = days[dayNumber];
  let time = `${hours}:${minutes}`;
  return { dayWeek, time };
}

function showForecast(forecast) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col text-center" id="forecast-day">
          <div class="forecast-days">${day.day}</div>
          <span class="forecast-temp-max">${day.tempMax}° /</span>
          <span class="forecast-temp-min">${day.tempMin}°</span>
          <br />
          <img src="icons/${day.icon}-50.png" 
          class="day-weather-icon" 
          alt = "${day.description}"
          />
        </div>
    `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function showWeather(response) {
  let temperature = Math.round(response.data.current.temp);
  temperatureCelsius = response.data.current.temp;
  let humidity = response.data.current.humidity;
  let wind = response.data.current.wind_speed;
  wind = wind.toFixed(1);
  let weatherDescription = response.data.current.weather[0].description;
  weatherDescription =
    weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  let weatherIcon = response.data.current.weather[0].icon;
  let dateUTC = response.data.current.dt;
  let date = getCurrentDate(dateUTC);

  let dailyForecastFull = response.data.daily;
  dailyForecastFull.pop();
  dailyForecastFull.pop();
  dailyForecastFull.pop();

  let dailyForecast = [];
  temp2Units = [];

  dailyForecastFull.forEach(function (day) {
    let dayDate = getCurrentDate(day.dt);
    let dayName = dayDate.dayWeek.substring(0, 3);
    let iconDay = day.weather[0].icon;
    let iconDesc = day.weather[0].description;

    let tempMaxC = Math.round(day.temp.max);
    let tempMinC = Math.round(day.temp.min);
    let tempMaxF = (day.temp.max - 32) / 1.8;
    let tempMinF = (day.temp.min - 32) / 1.8;
    tempMaxF = Math.round(tempMaxF);
    tempMinF = Math.round(tempMinF);

    let dayWeatherData = {
      day: `${dayName}`,
      tempMax: `${tempMaxC}`,
      tempMin: `${tempMinC}`,
      icon: `${iconDay}`,
      description: `${iconDesc}`,
    };

    let temp2UnitsOne = {
      day: `${dayName}`,
      tempMaxC: `${tempMaxC}`,
      tempMinC: `${tempMinC}`,
      tempMaxF: `${tempMaxF}`,
      tempMinF: `${tempMinF}`,
    };
    dailyForecast.push(dayWeatherData);
    temp2Units.push(temp2UnitsOne);
  });

  let h2 = document.querySelector("h2");
  let todayTemp = document.querySelector(".today-temp");
  let todayWeatherIcon = document.querySelector("#today-weather-icon");
  let todayWeatherDescription = document.querySelector("#weather-description");
  let todayHumidity = document.querySelector("#humidity");
  let todayWind = document.querySelector("#wind");

  h2.innerHTML = `${date.dayWeek}, ${date.time}`;
  todayWeatherDescription.innerHTML = weatherDescription;
  todayTemp.innerHTML = temperature;
  todayWeatherIcon.setAttribute("src", `icons/${weatherIcon}-100.png`);
  todayWeatherIcon.setAttribute("alt", `${weatherDescription}`);
  todayHumidity.innerHTML = `&nbsp;&nbsp;${humidity} %`;
  todayWind.innerHTML = `&nbsp;&nbsp${wind} m/s`;

  showForecast(dailyForecast);
}

function getForecast(response) {
  let h1 = document.querySelector("h1");

  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let cityName = response.data[0].name;

  h1.innerHTML = cityName;

  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function setCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#search-input");
  search(inputCity.value);
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", setCity);

function changeUnitFahrenheit(event) {
  event.preventDefault();
  let unitF = document.querySelector("#F-unit");
  let unitC = document.querySelector("#C-unit");
  unitF.classList.remove("sup-lite");
  unitF.classList.add("sup-dark");
  unitC.classList.remove("sup-dark");
  unitC.classList.add("sup-lite");
  let todayTemp = document.querySelector(".today-temp");
  let temperature = (temperatureCelsius - 32) / 1.8;
  todayTemp.innerHTML = Math.round(temperature);

  let forecastTempMax = document.querySelectorAll(".forecast-temp-max");
  let forecastTempMin = document.querySelectorAll(".forecast-temp-min");
  for (let i = 0; i < forecastTempMax.length; i++) {
    forecastTempMax[i].textContent = `${temp2Units[i].tempMaxF}° /`;
    forecastTempMin[i].textContent = `${temp2Units[i].tempMinF}°`;
  }
}

function changeUnitCelsius(event) {
  event.preventDefault();
  let unitC = document.querySelector("#C-unit");
  let unitF = document.querySelector("#F-unit");
  unitC.classList.remove("sup-lite");
  unitC.classList.add("sup-dark");
  unitF.classList.remove("sup-dark");
  unitF.classList.add("sup-lite");
  let todayTemp = document.querySelector(".today-temp");
  temperature = temperatureCelsius;
  todayTemp.innerHTML = Math.round(temperature);

  let forecastTempMax = document.querySelectorAll(".forecast-temp-max");
  let forecastTempMin = document.querySelectorAll(".forecast-temp-min");
  for (let i = 0; i < forecastTempMax.length; i++) {
    forecastTempMax[i].textContent = `${temp2Units[i].tempMaxC}° /`;
    forecastTempMin[i].textContent = `${temp2Units[i].tempMinC}°`;
  }
}

let temperatureCelsius = null;

let tempUnitC = document.querySelector("#temp-unit-celsius");
let tempUnitF = document.querySelector("#temp-unit-fahrenheit");

tempUnitF.addEventListener("click", changeUnitFahrenheit);
tempUnitC.addEventListener("click", changeUnitCelsius);

function search(city) {
  let apiURl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  axios.get(apiURl).then(getForecast);
}

search("Odesa");
