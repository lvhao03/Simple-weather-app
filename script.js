const cityName = document.querySelector('.city_name');
const cityTemperture = document.querySelector('.temperture');
const cityHumidity = document.querySelector('.humidlity');
const cityWind = document.querySelector('.wind');
const weatherName = document.querySelector('.weather_name');
const img = document.querySelector('.icon');

const reader = new FileReader();

reader.onloadend = () => {
  const base64data = reader.result;
  img.setAttribute('src', base64data);
};

function setData(data) {
  const { humidity, temp } = data.main;
  cityName.textContent = data.name;
  cityTemperture.innerText = temp;
  cityHumidity.textContent = humidity;
  cityWind.textContent = data.wind.speed;
  weatherName.textContent = data.weather[0].main;
}
async function getData() {
  const respone = await fetch('http://api.openweathermap.org/data/2.5/weather?q=Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh,VN&units=metric&appid=908e8e4dc8a81d0954cd688cc1dd27cb');
  const data = await respone.json();
  const respone2 = await fetch(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
  const icon = await respone2.blob();
  reader.readAsDataURL(icon);
  setData(data);
}

getData();
