const form = document.querySelector("form");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const searchHistory = document.getElementById("searchHistory");
const apiKey = "b7eaecfb4857d9dff9ff6ff0987eb379";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cityInput = document.getElementById("cityInput").value;
  fetchWeatherData(cityInput);
});

function fetchWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const weather = {
        city: data.name,
        date: formatDate(new Date()),
        icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        temperature: `${Math.round(data.main.temp)}°C`,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${Math.round(data.wind.speed)} m/s`,
      };
      displayCurrentWeather(weather);
      addSearchHistoryItem(city);
    })
    .catch((error) => {
      console.error(`Error fetching current weather data: ${error}`);
      currentWeather.innerHTML =
        "<p>Unable to fetch current weather data. Please try again later.</p>";
    });

  // Fetch 5-day forecast data
  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      const forecastData = [];
      data.list.forEach((item) => {
        if (item.dt_txt.includes("12:00:00")) {
          // Only show data for noon each day
          forecastData.push({
            date: formatDate(new Date(item.dt_txt)),
            icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`,
            temperature: `${Math.round(item.main.temp)}°C`,
            humidity: `${item.main.humidity}%`,
            windSpeed: `${Math.round(item.wind.speed)} m/s`,
          });
        }
      });
      displayForecast(forecastData);
    })
    .catch((error) => {
      console.error(`Error fetching forecast data: ${error}`);
      forecast.innerHTML =
        "<p>Unable to fetch forecast data. Please try again later.</p>";
    });
}

function displayCurrentWeather(weather) {
  currentWeather.innerHTML = `
    <h3>${weather.city} (${weather.date}) <img src="${weather.icon}" alt="${weather.description}"></h3>
    <p>Temperature: ${weather.temperature}</p>
    <p>Humidity: ${weather.humidity}</p>
    <p>Wind Speed: ${weather.windSpeed}</p>
  `;
}

function displayForecast(data) {
  let forecastHtml = "";
  data.forEach((item) => {
    forecastHtml += `
      <div>
        <h4>${item.date} <img src="${item.icon}" alt="${item.description}"></h4>
        <p>Temperature: ${item.temperature}</p>
        <p>Humidity: ${item.humidity}</p>
        <p>Wind Speed: ${item.windSpeed}</p>
      </div>
    `;
  });
  forecast.innerHTML = forecastHtml;
}
function addSearchHistoryItem(city) {
  const item = document.createElement("li");
  item.textContent = city;
  item.addEventListener("click", () => {
    fetchWeatherData(city);
  });
  searchHistory.appendChild(item);
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
