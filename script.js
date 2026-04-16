//standing code

let key = "d41bd599b278b642c07f40fbf670327bafc0fb0a0536c67430cf99ff7e9f232a";
const url = `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=152&APIkey=${key}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    renderStandigs(data);
  });
function renderStandigs(data) {
  let tableBody = document.querySelector(".tableBody");
  const teams = data.result.total;
  tableBody.innerHTML = "";
  teams.forEach((team) => {
    tableBody.innerHTML += `
       
    <tr>
          <td>
          ${team.standing_place}
          </td>

<td class="text-start">
<div class="team-info">
<img src="${team.team_logo}">
<span>${team.standing_team}</span>
</div>
</td>

      <td >${team.standing_P}</td>
     <td>${team.standing_W}</td>
     <td>${team.standing_D}</td>
      <td>${team.standing_L}</td>
     <td>${team.standing_F}</td>
     <td>${team.standing_A}</td>
     <td>${team.standing_GD}</td>
     <td class="score">${team.standing_PTS}</td>
    </tr>
  
        `;
        
  });
}


const leagueId = "152"; 
const topURL = `https://apiv2.allsportsapi.com/football/?met=Topscorers&leagueId=${leagueId}&APIkey=${key}`;

fetch(topURL)
  .then(res => res.json())
  .then(data => {
    if (data.success === 1 && data.result) {
      renderTopScorers(data.result);
    }
  })
  .catch(err => console.error('Error fetching scorers:', err));

function renderTopScorers(data) {
  const topTable = document.querySelector('.top-body');
  if (!topTable) return;
  topTable.innerHTML = '';

  data.slice(0, 10).forEach(item => {
    const assists = item.assists ?? 0;
    const shortName = item.player_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    topTable.innerHTML += `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <span class="rank me-3">${item.player_place}</span>
            <span class="avatar blue-avatar me-2">${shortName}</span>
            <div>
              <div class="player-name small fw-bold">${item.player_name}</div>
              <div class="player-team x-small " style="font-size:0.75rem ;color:white">${item.team_name}</div>
            </div>
          </div>
        </td>
        <td class="text-center"><span class="badge-stat blue-bg">${item.goals}</span></td>
        <td class="text-center"><span class="badge-stat green-text">${assists}</span></td>
      </tr>`;
  });
}

const teamsURL = `https://apiv2.allsportsapi.com/football/?met=Teams&leagueId=${leagueId}&APIkey=${key}`;

fetch(teamsURL)
  .then(res => res.json())
  .then(data => {
    if (data.success === 1) {
      let allPlayers = [];
      data.result.forEach(team => {
        if (team.players) {
          team.players.forEach(p => {
            p.team_name = team.team_name;
            p.team_logo = team.team_logo;
            allPlayers.push(p);
          });
        }
      });

      allPlayers.sort((a, b) => {
        const scoreA = parseInt(a.player_yellow_cards || 0) + parseInt(a.player_red_cards || 0);
        const scoreB = parseInt(b.player_yellow_cards || 0) + parseInt(b.player_red_cards || 0);
        return scoreB - scoreA;
      });

      renderCardsTable(allPlayers.slice(0, 15));
    }
  })
  .catch(err => console.error('Error fetching cards:', err));

function renderCardsTable(players) {
  const cardsBody = document.querySelector('.cards-body');
  if (!cardsBody) return;
  cardsBody.innerHTML = '';

  players.forEach((item, index) => {
    const shortName = item.player_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const playerImg = item.player_image 
        ? `<img src="${item.player_image}" class="player-img" style="width:30px; height:30px; border-radius:50%; object-fit:cover">`
        : `<span class="avatar blue-avatar me-2">${shortName}</span>`;

    cardsBody.innerHTML += `
      <tr>
        <td>
          <div class="d-flex align-items-center">
            <span class="rank me-2">${index + 1}</span>
            ${playerImg}
            <div class="ms-2">
              <div class="player-name small fw-bold">${item.player_name}</div>
              <div class="player-team x-small text-muted" style="font-size:0.7rem">
                <img src="${item.team_logo}" style="width:30px;height:30px; border-radius:50%; margin-right:2px"><span style="color:white"> ${item.team_name}</span>
              </div>
            </div>
          </div>
        </td>
        <td class="text-center text-warning fw-bold">${item.player_yellow_cards || 0}</td>
        <td class="text-center text-danger fw-bold">${item.player_red_cards || 0}</td>
      </tr>`;
  });
}
//matches page

const liveURL=`https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${key}`
fetch(liveURL).then(res=>res.json())
 .then(data => {
    if (data.success === 1 && data.result) {
      getLive(data.result);
    }
  })
  .catch(err => console.error('Fetch error:', err));

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
function getScore(result) {
    if (!result || result === "") {
        return {
           home: "-",
           away: "-" 
          };
    }
    const parts = result.split(" - ");
    return { home: parts[0], away: parts[1] };
}

function getLive(data) {
  const matches = document.querySelector('.matches-list');
  matches.innerHTML = '';
  let html = ''; 

  data.forEach((item) => {
    const score = getScore(item.event_final_result);
    
    const isStarted = item.event_status === "Finished" || item.event_live === "1";
    const scoreDisplay = isStarted 
      ? `<span class="score-num">${score.home}</span> <span class="score-divider">:</span> <span class="score-num">${score.away}</span>` 
      : `<span class="vs-label">VS</span>`;

    html += `
      <div class="match-card">
        <div class="match-inner d-flex align-items-center justify-content-between row">
          
          <div class="team col-4">
            <img src="${item.home_team_logo}" class="team-logo">
            <span class="team-name">${item.event_home_team}</span>
          </div>

          <div class="score-center col-4">
            <div class="score-display">
              ${scoreDisplay}  </div>
            <div class="event-date">${item.event_date}</div>
            ${getStatusBadge(item)}
          </div>

          <div class="team team away col-4">
            <span class="team-name">${item.event_away_team}</span>
            <img src="${item.away_team_logo}" class="team-logo">
          </div>

        </div>
      </div>
    `;
  });
  matches.innerHTML = html;
}

const dateFrom=document.querySelector('#dateFrom')
const dateTo=document.querySelector('#dateTo')
const searchBtn=document.querySelector('.search')
searchBtn.addEventListener('click',()=>{
const from=dateFrom.value
const to=dateTo.value
const dateUrl=`https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${key}&from=${from}&to=${to}`
fetch(dateUrl).then(res=>res.json())
.then((data)=>{
  if(data.success===1 && data.result){
    getLive(data.result)
  } else {
                document.querySelector('.matches-list').innerHTML = 
                    `<div class="text-center text-muted py-5">No matches found</div>`;
            }
          }) .catch(err => console.error('Fetch error:', err));
})

/* home page */

