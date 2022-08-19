/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable default-case */
/* eslint-disable arrow-parens */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
const container = document.querySelector('.container');
console.log(container);
const cityName = document.querySelector('.city_name');
const cityTemperture = document.querySelector('.temperture');
const cityHumidity = document.querySelector('.humidlity');
const cityWind = document.querySelector('.wind');
const weatherName = document.querySelector('.weather_name');
const feelLike = document.querySelector('.feel_like');
const mutipleImages = document.querySelectorAll('.icon');
const airPolution = document.querySelector('.air_polution');
const input = document.querySelector('.input');
const submitBtn = document.querySelector('.submit');
const reader = new FileReader();

const hideDivs = document.querySelectorAll('.hide');
const weatherDate = document.querySelectorAll('.weather_date');
const tempMax = document.querySelectorAll('.temp_max');
const tempMin = document.querySelectorAll('.temp_min');
let numberOfImage = 0;

function getUserInput(event) {
  event.preventDefault();
  return input.value;
}

reader.onloadend = () => {
  const base64data = reader.result;
  mutipleImages[numberOfImage].setAttribute('src', base64data);
  numberOfImage++;
};

function disableHide() {
  hideDivs.forEach(ele => {
    ele.classList.remove('hide');
  });
}

function showCurrentDate(data, airPolutionData) {
  const arr = data.list;
  const { humidity, temp, feels_like } = arr[0].main;
  checkAirQuality(airPolutionData.list[0].main.aqi);
  checkWeather(arr[0].weather[0].main);
  disableHide();
  cityName.textContent = data.city.name;
  cityWind.textContent = arr[0].wind.speed;
  weatherName.textContent = arr[0].weather[0].main;
  cityTemperture.innerText = temp + '°C';
  cityHumidity.textContent = humidity;
  feelLike.textContent = 'Feel like ' + feels_like + '°';
}

function showNextFewDays(data) {
  const arr = data.list;
  let groupHoursPerDay = 8;
  for (let i = 0; i < tempMax.length; i++) {
    const { temp_min, temp_max } = arr[groupHoursPerDay].main;
    weatherDate[i].textContent = moment.unix(arr[groupHoursPerDay].dt).format('DD/MM/YY');
    tempMax[i].textContent = temp_max + '°';
    tempMin[i].textContent = temp_min + '°';
    groupHoursPerDay += 8;
  }
}

function checkWeather(data) {
  const weather = data.toLowerCase();
  switch (weather) {
    case 'rain':
        return changeBackgroundColor(0);
    case 'clouds':
        return changeBackgroundColor(1);
  }
}

function changeBackgroundColor(index) {
  const linearGradientColor = 'linear-gradient(to right, rgba(50, 80, 77, 0.2), rgba(20, 100, 150, 0.2))';
  const backGroundColors = ['https://r1.ilikewallpaper.net/ipad-air-wallpapers/download/37694/Close-up-drop-black-blue-rain-ipad-air-wallpaper-ilikewallpaper_com.jpg', 'https://images.unsplash.com/photo-1514477917009-389c76a86b68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGluayUyMHNreXxlbnwwfHwwfHw%3D&w=1000&q=80'];
  container.style.background = `${linearGradientColor}, url(${backGroundColors[index]})`;
}

function checkAirQuality(index) {
  const arr = ['#79BC6A', '#99CC00', '#FFCC00', '#FF9900', '#CC0033'];
  switch (index) {
    case 1:
        airPolution.textContent = 'Good';
        airPolution.style.backgroundColor = arr[0];
        break;
    case 2:
        airPolution.textContent = 'Fair';
        airPolution.style.backgroundColor = arr[1];
        break;
    case 3:
        airPolution.textContent = 'Moderate';
        airPolution.style.backgroundColor = arr[2];
        break;
    case 4:
        airPolution.textContent = 'Poor';
        airPolution.style.backgroundColor = arr[3];
        break;
    case 5:
        airPolution.textContent = 'Very Poor';
        airPolution.style.backgroundColor = arr[4];
        break;
  }
}

async function getImages(data) {
  const arr = data.list;
  let j = 0;
  for (let i = 0; i < mutipleImages.length; i++) {
    const respone = await fetch(`https://openweathermap.org/img/wn/${arr[j].weather[0].icon}@2x.png`);
    const imageBlob = await respone.blob();
    reader.readAsDataURL(imageBlob);
    j += 8;
  }
  numberOfImage = 0;
}

function fetchGeoLocation() {
  const location = getUserInput(event);
  return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=908e8e4dc8a81d0954cd688cc1dd27cb`)
    .then(respone => respone.json());
}

function getWeatherData(lat, lon) {
  return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=908e8e4dc8a81d0954cd688cc1dd27cb&lang=vi`)
  .then(response => response.json());
}

function getAirPolutionData(lat, lon) {
  return fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=908e8e4dc8a81d0954cd688cc1dd27cb&lang=vi`)
  .then(respone => respone.json());
}

async function getGeoLocation() {
  const arr = await fetchGeoLocation();
  return arr[0];
}

async function getData() {
  const { lat, lon } = await getGeoLocation();
  const weatherData = await getWeatherData(lat, lon);
  const airPolutionData = await getAirPolutionData(lat, lon);
  getImages(weatherData);
  showCurrentDate(weatherData, airPolutionData);
  showNextFewDays(weatherData);
}
submitBtn.addEventListener('click', getData);
