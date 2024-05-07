const language = "uk";

document.querySelector("body").onload = setLocation();

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", onSubmit);

const cityInput = document.querySelector(".city");
const weatherInfoParentArray = Array.from(document.querySelector(".weather-info").children);

async function setLocation(){
  const city = await getLocation();
  if(city){
    const weather = await getWeather(city, language);
    setWeatherInfo(weather);
  }
}

async function getLocation(){
  const locationData = await fetch("https://api.ipdata.co?api-key=9a161b5d9fdd32f4441bfe6aaf32078a994e04db5a0bf26861703299");
  const locationJson = await locationData.json();
  return locationJson.city || null
}

async function onSubmit(event){
  event.preventDefault();
  
  const cityName = cityInput.value;
  const weather = await getWeather(cityName, language);
  setWeatherInfo(weather);

};
async function getWeather(city, language) {
  const weatherData = await fetch(`http://api.weatherapi.com/v1/.json/current.json?key=a38a326c50334925bd2194147240605&q=${city}&lang=${language}&days=15`);
  const weatherJson = await weatherData.json();
  return weatherJson;
};

function setWeatherInfo(info){
  const city = weatherInfoParentArray.find((el) => el.className == "city");
  const condition = weatherInfoParentArray.find((el) => el.className == "condition");
  const temp = weatherInfoParentArray.find((el) => el.className == "temp");
  const feelsLikeTemp = weatherInfoParentArray.find((el) => el.className == "feelslike-temp");
  const uv = weatherInfoParentArray.find((el) => el.className == "uv");
  const humidity = weatherInfoParentArray.find((el) => el.className == "humidity");
  const gust = weatherInfoParentArray.find((el) => el.className == "gust");
  

  if(info.error){
    for(i = 0; i< weatherInfoParentArray.length; i++){
      weatherInfoParentArray[i].innerHTML = "";
    }
    city.innerHTML="Помилка! Спробуйте знову ввести місто";
    return;
  }

  city.innerHTML = info.location.name;
  condition.innerHTML = `Стан: ${info.current.condition.text}`;
  temp.innerHTML = `Температура:${info.current.temp_c }°C`;
  feelsLikeTemp.innerHTML = `Відчувається як: ${info.current.feelslike_c} °C`;
  uv.innerHTML = `УФ індекс: ${info.current.uv}`;
  humidity.innerHTML = `Вологість: ${info.current.humidity}%`;
  gust.innerHTML = `Вітер: ${info.current.gust_kph} км/год`;


}