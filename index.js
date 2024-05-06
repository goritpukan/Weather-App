const language = "uk";


const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", onSubmit);

const cityInput = document.querySelector(".city");

const weatherCityInfo = document.querySelector(".weather-city-info");
const weatherCondition = document.querySelector(".weather-condition");
const weatherTemp = document.querySelector(".weather-temp");

setLocation();

async function setLocation(){
  const city = await getLocation();
  if(city){
    getWeather(city, language)
  }
}

async function getLocation(){
  const locatiomData = await fetch("https://api.ipdata.co?api-key=9a161b5d9fdd32f4441bfe6aaf32078a994e04db5a0bf26861703299");
  const locationJson = await locatiomData.json();
  return locationJson.city || null
}

function onSubmit(event){
  event.preventDefault();
  
  const cityName = cityInput.value;
  getWeather(cityName, language);

};
function getWeather(city, language) {
  fetch(`http://api.weatherapi.com/v1/current.json?key=a38a326c50334925bd2194147240605&q=${city}&lang=${language}&days=15`)
  .then(res => res.json())
  .then(result => {
    console.log(result);
    setWeatherInfo(result);
  })
  .catch(err => setWeatherInfo(err));
};

function setWeatherInfo(info){
  if(info.error){
    weatherTemp.innerHTML = "";
    weatherCondition.innerHTML = "";
    weatherCityInfo.innerHTML="Помилка! Спробуйте знову ввести місто";
    return;
  }

  weatherCityInfo.innerHTML = info.location.name
  weatherCondition.innerHTML = `Стан: ${info.current.condition.text}`;
  weatherTemp.innerHTML = `${info.current.temp_c }°C`
}