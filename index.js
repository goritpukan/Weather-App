const language = "uk";


const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", onSubmit);

const cityInput = document.querySelector(".city");

const weatherCondition = document.querySelector(".weather-condition");
const weatherTemp = document.querySelector(".weather-temp");

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
    setWeatherInfo(result)
    
  })
  .catch(err => setWeatherInfo(err));
};

function setWeatherInfo(info){
  if(info.error){
    weatherTemp.innerHTML = "";
    weatherCondition.innerHTML="Помилка! Спробуйте знову ввести місто";
    return;
  }
  weatherCondition.innerHTML = `Стан: ${info.current.condition.text}`;
  weatherTemp.innerHTML = `${info.current.temp_c }°C`
}