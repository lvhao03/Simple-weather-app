/* eslint-disable arrow-parens */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */
/* eslint-disable no-restricted-globals */
/* eslint-disable indent */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
const cityName = document.querySelector('.city_name');
const cityTemperture = document.querySelector('.temperture');
const cityHumidity = document.querySelector('.humidlity');
const cityWind = document.querySelector('.wind');
const weatherName = document.querySelector('.weather_name');
const feelLike = document.querySelector('.feel_like');
const mutipleImages = document.querySelectorAll('.icon');
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

function showCurrentDate(data) {
  disableHide();
  const arr = data.list;
  const { humidity, temp, feels_like } = arr[0].main;
  cityName.textContent = data.city.name;
  cityWind.textContent = arr[0].wind.speed;
  weatherName.textContent = arr[0].weather[0].main;
  cityTemperture.innerText = temp + '°C';
  cityHumidity.textContent = humidity;
  feelLike.textContent = 'Feel like ' + feels_like + '°';
}

function showNextFewDays(data) {
  const arr = data.list;
  let j = 8;
  for (let i = 0; i < tempMax.length; i++) {
    const { temp_min, temp_max } = arr[j].main;
    weatherDate[i].textContent = moment.unix(arr[j].dt).format('DD/MM/YY');
    tempMax[i].textContent = temp_max + '°';
    tempMin[i].textContent = temp_min + '°';
    j += 8;
  }
}

async function setImages(data) {
  const arr = data.list;
  let j = 0;
  for (let i = 0; i < mutipleImages.length; i++) {
    const respone = await fetch(`https://openweathermap.org/img/wn/${arr[j].weather[0].icon}@2x.png`);
    const imageBlob = await respone.blob();
    reader.readAsDataURL(imageBlob);
    j += 9;
  }
}

async function getData() {
  const location = getUserInput(event);
  const respone3 = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=908e8e4dc8a81d0954cd688cc1dd27cb`);
  const a = await respone3.json();
  const { lat, lon } = a[0];
  const respone = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=908e8e4dc8a81d0954cd688cc1dd27cb&lang=vi`);
  const data = await respone.json();
  setImages(data);
  showCurrentDate(data);
  showNextFewDays(data);
}
submitBtn.addEventListener('click', getData);
