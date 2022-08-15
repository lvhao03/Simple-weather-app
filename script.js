/* eslint-disable camelcase */
const cityName = document.querySelector('.city_name');
const cityTemperture = document.querySelector('.temperture');
const cityHumidity = document.querySelector('.humidlity');
const cityWind = document.querySelector('.wind');
const weatherName = document.querySelector('.weather_name');
const feelLike = document.querySelector('.feel_like');
const img = document.querySelector('.icon');

const input = document.querySelector('.input');
const submitBtn = document.querySelector('.submit');
const reader = new FileReader();

function getUserInput(event) {
  event.preventDefault();
  return input.value;
}

reader.onloadend = () => {
  const base64data = reader.result;
  img.setAttribute('src', base64data);
};

function setData(data) {
  const { humidity, temp, feels_like } = data.main;
  cityName.textContent = data.name;
  cityTemperture.innerText = temp;
  cityHumidity.textContent = humidity;
  cityWind.textContent = data.wind.speed;
  weatherName.textContent = data.weather[0].main;
  feelLike.textContent = feels_like;
}
async function getData() {
  const location = getUserInput(event);
  const respone = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=908e8e4dc8a81d0954cd688cc1dd27cb&lang=vi`);
  const data = await respone.json();
  const respone2 = await fetch(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
  const icon = await respone2.blob();
  reader.readAsDataURL(icon);
  setData(data);
}
submitBtn.addEventListener('click', getData);
