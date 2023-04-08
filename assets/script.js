const buttonsEl = $("#buttons");
const searchButtonEl = $("#searchBtn");
const cityInput = $("#cityInput");
const forecast = $("#forecast");
const modalEl = $("#noCity");
let city;
let cityReturn;
let lat;
let lon;
let weather0;
let weatherForecast;
let savedCities = [];

if (localStorage.getItem("savedCities")) {
  savedCities = JSON.parse(localStorage.getItem("savedCities"));
  for (i = 0; i < savedCities.length; i++) {
    const cityBtn = $("<button>");
    cityBtn.text(savedCities[i]);
    $(cityBtn).data("city", savedCities[i]);
    cityBtn.addClass("savedCityBtn");
    $(buttonsEl).append(cityBtn);
  }
}

function closeModalHandler() {
  modalEl.hide();
}
function savedBtnHandler(event) {
  city = $(event.target).data("city");
  setRequestCityUrl(city);
}
function searchHandler(event) {
  event.preventDefault();
  city = cityInput[0].value;
  setRequestCityUrl(city);
}
function setRequestCityUrl() {
  const cityUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=c6556a496e3f62f9fdb73f2b66369ef4";
  $.ajax({
    url: cityUrl,
    method: "Get",
  })
    .then(function (data) {
      cityReturn = data[0].local_names.en;
      lat = data[0].lat;
      lon = data[0].lon;
      setRequestWeatherUrl();
    })
    .catch(function () {
      modalEl.show();
    });
}
function setRequestWeatherUrl() {
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=c6556a496e3f62f9fdb73f2b66369ef4";
  $.ajax({
    url: weatherUrl,
    method: "Get",
  }).then(function (data) {
    weather0 = data.list[0];
    const weather1 = data.list[8];
    const weather2 = data.list[16];
    const weather3 = data.list[24];
    const weather4 = data.list[32];
    const weather5 = data.list[39];
    weatherForecast = [weather1, weather2, weather3, weather4, weather5];
    displayForecast();
  });
}
function displayForecast() {
  const cityDateEl = $("#cityDate");
  const todayIcon = $("#todayIcon");
  const todayTempEl = $("#todayTemp");
  const todayWindEl = $("#todayWind");
  const todayHumidityEl = $("#todayHumidity");
  const weatherFutureEl = $("#weatherFuture")[0];
  cityDateEl.text(cityReturn + " - " + weather0.dt_txt);
  todayIcon.attr({
    src:
      "https://openweathermap.org/img/wn/" +
      weather0.weather[0].icon +
      "@2x.png",
    alt: weather0.weather[0].description,
  });
  todayTempEl.text(
    "Temperature: " + tempConvert(weather0.main.temp) + " Degrees Fahrenheit"
  );
  todayWindEl.text("Wind: " + windConvert(weather0.wind.speed) + " MPH");
  todayHumidityEl.text("Humidity: " + weather0.main.humidity + "%");
  for (i = 0; i < weatherForecast.length; i++) {
    $(weatherFutureEl.children[i])
      .children()
      .eq(0)
      .text(cityReturn + " - " + weatherForecast[i].dt_txt);
    $(weatherFutureEl.children[i])
      .children("img")
      .attr({
        src:
          "https://openweathermap.org/img/wn/" +
          weatherForecast[i].weather[0].icon +
          "@2x.png",
        alt: weatherForecast[i].weather[0].description,
      });
    $(weatherFutureEl.children[i])
      .children()
      .eq(2)
      .children()
      .eq(0)
      .text(
        "Temperature: " +
          tempConvert(weatherForecast[i].main.temp) +
          " Degrees Fahrenheit"
      );
    $(weatherFutureEl.children[i])
      .children()
      .eq(2)
      .children()
      .eq(1)
      .text("Wind: " + windConvert(weatherForecast[i].wind.speed) + " MPH");
    $(weatherFutureEl.children[i])
      .children()
      .eq(2)
      .children()
      .eq(2)
      .text("Humidity: " + weatherForecast[i].main.humidity + "%");
  }
  forecast.show();
  saveCity();
}
function tempConvert(kelvin) {
  const fahrenheit = Math.floor(((kelvin - 273.15) * 9) / 5 + 32);
  return fahrenheit;
}
function windConvert(mps) {
  const mph = Math.floor(mps * 2.237);
  return mph;
}
function saveCity() {
  const cityBtn = $("<button>");
  if (savedCities) {
    for (i = 0; i < savedCities.length; i++) {
      if (savedCities[i] === cityReturn) {
        return;
      }
    }
  }
  cityBtn.text(cityReturn);
  $(cityBtn).data("city", cityReturn);
  cityBtn.addClass("savedCityBtn");
  $(buttonsEl).append(cityBtn);
  savedCities.push(cityBtn.text());
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

$(searchButtonEl).on("click", searchHandler);
$(buttonsEl).on("click", ".savedCityBtn", savedBtnHandler);
$(modalEl).on("click", ".close", closeModalHandler);
