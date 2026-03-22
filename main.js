const dateElement = document.getElementById("current-date");
const today=new Date()
const options = { year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('en-US', options);
const weatherInfo=document.querySelector('.weather-info')

const weatherKey = '6eca3fc113c71e0bb6571f07fa7dc72e';
const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=30.0444&lon=31.2357&appid=${weatherKey}&units=metric`;

fetch(weatherApi) 
    .then(res => res.json())
    .then((data) => {
        displayWeather(data);
    })
    .catch(err => console.error("Error:", err));

function displayWeather(data) {
    const temp = data.main.temp.toFixed(1);
   
    const cityName = data.name;
    
const iconCode = data.weather[0].icon;


const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

      weatherInfo.innerHTML=
      `
<img src="${iconUrl}" alt="Weather Icon" class="weather-icon-img" style="width: 50px; height: 50px; ">
    <span class="small">${temp}°C ${cityName}</span>

      `
}