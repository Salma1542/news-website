const dateElement = document.getElementById("current-date");
const today=new Date()
const options = { year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = today.toLocaleDateString('en-US', options);


const weatherInfo=document.querySelector('.weather-info')

// const newsKey = 'ff0c06160f674c5b119944f83d148d0e';
const newsKey='37e95931c201117e2c3960fc64215d86'
// const newsKey='ea3f326d823994a01f92bd1b7b2c0ea2'

const topNews = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${newsKey}`;

fetch(topNews)
    .then(res => res.json())
    .then(data => {
        if (data.articles && data.articles.length > 0) {
            getTopHeadlines(data.articles);
        }
    })
    .catch(error => {
        console.error('Error fetching news:', error);
        let topContainer = document.querySelector('.topContainer');
        topContainer.innerHTML = `<p class="text-center text-danger">Error loading news. Please check your API key or network connection.</p>`;
    });

function getTopHeadlines(news) {
    let topContainer = document.querySelector('.topContainer');
    let bottomContainer = document.querySelector('.bottomContainer');

    topContainer.innerHTML = '';
    bottomContainer.innerHTML = '';

    if (!news || news.length === 0) {
        topContainer.innerHTML = `<p>No news available</p>`;
        return;
    }

    let first = news[0];

    let mainhtml = `
        <div class="col-lg-8">
            <div class="card bg-dark text-white border-0 h-100 custom-card"
                style="background-image: url('${first.image || './images/post_7-min.jpg'}'); background-size: cover; background-position: center;">
                
                <div class="card-img-overlay d-flex flex-column justify-content-end p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                    <span class="badge bg-info mb-2 w-fit" style="width: fit-content;">TRENDING</span>
                    <h2 class="card-title h4">${first.title || 'No title available'}</h2>
                    <p class="card-text small text-secondary">
                        ${first.source?.name || 'Unknown'}  ${new Date(first.publishedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    `;

    let second = news[1];

    let sideNews = `
        <div class="col-lg-4">
            <div class="card bg-dark text-white border-0 h-100 custom-card"
                style="background-image: url('${second?.image || "./images/default.jpg"}'); background-size: cover; background-position: center;">
                
                <div class="card-img-overlay d-flex flex-column justify-content-end p-4" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                    <span class="badge bg-warning text-dark mb-2 w-fit" style="width: fit-content;">FEATURED</span>
                    <h2 class="card-title h5">${second?.title?.substring(0, 60) || 'No title available'}${second?.title?.length > 60 ? '...' : ''}</h2>
                    <p class="card-text small text-secondary">
                        ${second?.source?.name || "Unknown"}
                    </p>
                </div>
            </div>
        </div>
    `;

    topContainer.innerHTML = mainhtml + sideNews;

    let bottomNews = news.slice(2, 5);

    bottomNews.forEach(n => {
        bottomContainer.innerHTML += `
            <div class="col-md-4 col-sm-12 mb-3">
                <div class="d-flex align-items-center bg-transparent p-2 bottom">
                    <img src="${n.image || "./images/default.jpg"}"
                        class="rounded me-3"
                        style="width: 150px; height: 120px; object-fit: cover;">
                    <div>
                        <span class="badge bg-info mb-1">NEWS</span>
                        <h6 class="mb-0 title">${n.title?.substring(0, 40) || 'No title'}${n.title?.length > 40 ? '...' : ''}</h6>
                        <small class="text-secondary">${n.source?.name || 'Unknown'}</small>
                    </div>
                </div>
            </div>
        `;
    });
}const category = ['Economy', 'Technology', 'Entertainment', 'Sports', 'Science', 'Health'];

async function initNews() {
    const newsContainer = document.querySelector('#news-sections');
    if (!newsContainer) return;

    newsContainer.innerHTML = '<div class="text-center text-white">Loading sections...</div>';
    
    let allHtml = ''; 

    for (const cat of category) {
        try {
            const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${cat.toLowerCase()}&lang=en&apikey=${newsKey}`);
            const data = await response.json();

            if (data.articles && data.articles.length > 0) {
                allHtml += generateCategoryHtml(cat, data.articles.slice(0, 3));
            }
            
            newsContainer.innerHTML = allHtml;

        } catch (err) {
            console.error("Error fetching " + cat, err);
        }
    }
}

function generateCategoryHtml(catName, news) {
    let cardsHtml = '';

    news.forEach(article => {
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        cardsHtml += `
            <div class="col-md-4">
                <div class="card bg-dark text-white border-0 h-100 shadow-sm custom-hover">
                    <img src="${article.image || './images/default-news.jpg'}" 
                         class="card-img-top" 
                         style="height: 180px; object-fit: cover; border-radius: 8px 8px 0 0;">
                    
                    <div class="card-body d-flex flex-column p-3">
                        <h5 class="card-title h6 fw-bold mb-2" style="height: 2.5rem; overflow: hidden;">
                            ${article.title}
                        </h5>
                        <p class="card-text text-secondary small mb-3" style="height: 3.5rem; overflow: hidden;">
                            ${article.description || "Click 'Read More' to see full details."}
                        </p>
                        <div class="mt-auto">
                            <hr class="border-secondary opacity-25">
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-info" style="font-size: 0.75rem;">
                                    <i class="bi bi-clock me-1"></i> ${publishedDate}
                                </small>
                                <a href="${article.url}" target="_blank" class="btn btn-sm btn-link text-info p-0 text-decoration-none fw-bold">
                                    Read More <i class="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    return `
        <div class="category-section mb-5">
            <h3 class="text-white border-start border-4 border-info ps-3 mb-4 text-uppercase fw-bold">
                ${catName}
            </h3>
            <div class="row g-4">${cardsHtml}</div>
        </div>`;
}

document.addEventListener('DOMContentLoaded', initNews);

const weatherKey = '6eca3fc113c71e0bb6571f07fa7dc72e';
const weatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=30.0444&lon=31.2357&appid=${weatherKey}&units=metric`;

fetch(weatherApi) 
    .then(res => res.json())
    .then((data) => {
        displayWeather(data);
    })
    .catch(err => console.error("Error:", err));

function displayWeather(data) {
    const weatherContainer = document.querySelector('.weather-card');
    const temp = data.main.temp.toFixed(1);
    const feelsLike = data.main.feels_like.toFixed(1);
    const humidity = data.main.humidity;
    const condition = data.weather[0].main;
    const cityName = data.name;
    const country = data.sys.country;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1);
const iconCode = data.weather[0].icon;

console.log(iconCode);

const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

console.log("Icon Link:", iconUrl);
    weatherContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <div class="weather-title">Weather</div>
          <div class="weather-subtitle">Current weather &nbsp; ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </div>
        <div class="weather-date">${new Date().toLocaleDateString('en-GB').replace(/\//g, ' / ')}</div>
      </div>

      <div class="weather-temp-row">
<img src="${iconUrl}" alt="Weather Icon" class="weather-icon-img" style="width: 80px; height: 80px; ">
        <span class="weather-temp">${temp}°C</span>
      </div>

      <hr class="weather-divider">

      <div class="row g-3">
        <div class="col-6 weather-detail-item">
<i class="bi bi-thermometer-half text-primary fs-4"></i>
          <div>
            <div class="weather-detail-value">${feelsLike}°C</div>
            <div class="weather-detail-label">Feels Like</div>
          </div>
        </div>
        <div class="col-6 weather-detail-item">
<i class="bi bi-percent text-primary fs-4"></i>
          <div>
            <div class="weather-detail-value">${humidity}%</div>
            <div class="weather-detail-label">Humidity</div>
          </div>
        </div>
        <div class="col-6 weather-detail-item">
<i class="bi bi-pin-angle-fill text-primary fs-4"></i>
          <div>
            <div class="weather-detail-value">${condition}</div>
            <div class="weather-detail-label">Condition</div>
          </div>
        </div>
        <div class="col-6 weather-detail-item">
<i class="bi bi-geo-alt text-primary fs-4"></i>
          <div>
            <div class="weather-detail-value">${cityName}</div>
            <div class="weather-detail-label">Current City</div>
          </div>
        </div>
        <div class="col-6 weather-detail-item">
<i class="bi bi-wind text-primary fs-4"></i>
          <div>
            <div class="weather-detail-value">${windSpeed} Km/H</div>
            <div class="weather-detail-label">Wind Info</div>
          </div>
        </div>
        <div class="col-6 weather-detail-item">
<i class="bi bi-globe text-primary fs-4"></i>
          <div>
            <div class="weather-detail-value">${country}</div>
            <div class="weather-detail-label">Country</div>
          </div>
        </div>
      </div>`;

      weatherInfo.innerHTML=
      `
<img src="${iconUrl}" alt="Weather Icon" class="weather-icon-img" style="width: 50px; height: 50px; ">
    <span class="small">${temp}°C ${cityName}</span>

      `
}
const currencyKey='9940f06506f4ddef74bad210'
const currencyUrl = "https://open.er-api.com/v6/latest/USD";

async function getExchangeRates() {
    try {
        const response = await fetch(currencyUrl);
        const data = await response.json();
        
        const egpRate = data.rates.EGP.toFixed(2);
        
      
        const sarToUsd = data.rates.SAR;
        const sarRate = (data.rates.EGP / sarToUsd).toFixed(2);

        document.getElementById('usd-rate').innerText = `${egpRate} EGP`;
        document.getElementById('sar-rate').innerText = `${sarRate} EGP`;

    } catch (error) {
        console.error("Currency Error:", error);
    }
}

getExchangeRates();



const liveKey = 'd41bd599b278b642c07f40fbf670327bafc0fb0a0536c67430cf99ff7e9f232a'; 

const liveURL=`https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${liveKey}`
fetch(liveURL).then(res=>res.json())
 .then(data => {
    if (data.success === 1 && data.result) {
      getLive(data.result);
    }
  })
  .catch(err => console.error('Fetch error:', err));
  function getScore(result) {
  if (!result || result === "") {
    return {
      home: "-",
      away: "-"
    };
  }

  const parts = result.split(" - ");
  return {
    home: parts[0],
    away: parts[1]
  };
}
function getStatusBadge(item) {
    if (item.event_status === "Finished") {
        return `<span class="match-status status-finished">Finished</span>`;
    } else if (item.event_live === "1") {
        return `<span class="match-status status-live">
                    <span class="live-dot"></span> ${item.event_status}
                </span>`;
    } else {
        return `<span class="match-status status-upcoming"> upcoming at ${item.event_time}</span>`;
    }
}
  function getLive(data){
 const matches=document.getElementById('matches-container')
  matches.innerHTML = '';

  const liveMatches = data.filter(item => item.event_live === "1").slice(0,4);

  let html = '';

  if (liveMatches.length === 0) {
    matches.innerHTML = `<p class="text-center">No live matches now ⚽</p>`;
    return;
  }

  liveMatches.forEach((item) => {
    const score = getScore(item.event_final_result);

    html += `
  <div class="live-match d-flex align-items-center justify-content-between mb-2 p-3 rounded">

    <div class="team d-flex align-items-center gap-2 ">
      <img src="${item.home_team_logo}" class="team-logo">
      <span class="team-name">${item.event_home_team}</span>
    </div>

    <div class="center text-center">
      <div class="score fw-bold">
        ${score.home} : ${score.away}
      </div>
      <div class="live-status">
               <span class="live-dot"></span>
 ${item.event_status}
      </div>
    </div>

    <div class="team d-flex align-items-center gap-2 ">
      <span class="team-name">${item.event_away_team}</span>
      <img src="${item.away_team_logo}" class="team-logo">
    </div>

  </div>
`;
  });
  html += `
  <div class="text-center mt-3">
    <a href="matches.html" class="btn btn-outline-light btn-sm">
      View All Live Matches →
    </a>
  </div>
`;

  matches.innerHTML = html;
}