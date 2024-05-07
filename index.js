const language = "uk";

document.querySelector("body").onload = setLocation();

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", onSubmit);

const cityInput = document.querySelector(".city");
const weatherInfoParentArray = Array.from(document.querySelector(".weather-info").children);


function changeLoaderDisplay(){
  const loaderStyle = document.querySelector(".loader-div").style;
  if(loaderStyle.display === "none" || loaderStyle.display === ""){
    loaderStyle.display = "flex";
    return;
  }
  loaderStyle.display = "";

}
async function setLocation(){
  const city = await getLocation();
  if(city){
    const weather = await getWeather(city, language);
    setWeatherInfo(weather);
  }
}

async function getLocation(){
  changeLoaderDisplay();
  const locationData = await fetch("https://api.ipdata.co?api-key=9a161b5d9fdd32f4441bfe6aaf32078a994e04db5a0bf26861703299");
  const locationJson = await locationData.json();
  changeLoaderDisplay();
  return locationJson.city || null
}

async function onSubmit(event){
  event.preventDefault();
  
  const cityName = cityInput.value;
  const weather = await getWeather(cityName, language);
  setWeatherInfo(weather);

};
async function getWeather(city, language) {
  changeLoaderDisplay();
  const weatherData = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=a38a326c50334925bd2194147240605&q=${city}&lang=${language}&days=14`);
  const weatherJson = await weatherData.json();
  changeLoaderDisplay();
  return weatherJson;
};

function setWeatherInfo(info){
  const city = weatherInfoParentArray.find((el) => el.className == "city");
  const condition = weatherInfoParentArray.find((el) => el.className == "condition");
  const conditionImage = weatherInfoParentArray.find((el) => el.className == "condition-image");
  const temp = weatherInfoParentArray.find((el) => el.className == "temp");
  const feelsLikeTemp = weatherInfoParentArray.find((el) => el.className == "feelslike-temp");
  const uv = weatherInfoParentArray.find((el) => el.className == "uv");
  const humidity = weatherInfoParentArray.find((el) => el.className == "humidity");
  const gust = weatherInfoParentArray.find((el) => el.className == "gust");
  const forecastHoursList = weatherInfoParentArray.find((el) => el.className == "forecast-hours-list");
  const forecastDaysList = weatherInfoParentArray.find((el) => el.className == "forecast-days-list");

  //Додати верогідність дощу и прогнз по годинам и на тиждень
  

  if(info.error){
    for(i = 0; i< weatherInfoParentArray.length; i++){
      weatherInfoParentArray[i].innerHTML = "";
    }
    city.innerHTML="Помилка! Спробуйте знову ввести місто";
    return;
  }

  city.innerHTML = info.location.name;
  condition.innerHTML = `Стан: ${info.current.condition.text}`;
  conditionImage.src = info.current.condition.icon;
  temp.innerHTML = `Температура:${info.current.temp_c }°C`;
  feelsLikeTemp.innerHTML = `Відчувається як: ${info.current.feelslike_c} °C`;
  uv.innerHTML = `УФ індекс: ${info.current.uv}`;
  humidity.innerHTML = `Вологість: ${info.current.humidity}%`;
  gust.innerHTML = `Вітер: ${info.current.gust_kph} км/год`;


  for(let i of info.forecast.forecastday[0].hour){
    const li = document.createElement("li");
    const img = document.createElement("img");

    img.src = i.condition.icon
    li.innerHTML = `${i.time.split(" ")[1]}  ${i.temp_c} °C ${i.chance_of_rain || i.chance_of_snow}%`
    forecastHoursList.appendChild(li);
    li.appendChild(img);
  }

  for(let i of info.forecast.forecastday){
    const li = document.createElement("li");
    const img = document.createElement("img");

    img.src = i.day.condition.icon;
    li.innerHTML = `${i.date}  ${i.day.avgtemp_c} °C ${i.day.daily_chance_of_rain || i.day.daily_chance_of_snow}% `
    forecastDaysList.appendChild(li);
    li.appendChild(img);
    
  }


}