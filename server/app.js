const express = require('express')
const path = require('path')
const axios = require('axios');
const { match } = require('assert');

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001;

// have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/test', (req, res) => {
  axios.get(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/StormRazr`,
    {headers: { 'X-Riot-Token': process.env.RIOT_API_KEY}}
  )
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.json('Hello World!')
    });   
})

// get summoner profile data
app.get('/api/profile/:summoner', (req, res) => {
  let summoner = req.params.summoner;
  let summonerData = {}
  axios.get(
    `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
    {headers: { 'X-Riot-Token': process.env.RIOT_API_KEY}}
  )
    .then(res => {
      const data = res.data;
      summonerData = {
        summonerId: data.id,
        accountId: data.accountId,
        puuid: data.puuid,
        name: data.name,
        profileIconId: data.profileIconId,
        summonerLevel: data.summonerLevel,
      }
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.status(200).json(summonerData)
    });  
})

// get summoner ranked data
app.get('/api/profile/ranked/:summonerId', (req, res) => {
  let encryptedSummonerId = req.params.summonerId;
  let summonerRankedData = {};

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function extractQueueType(str) {
    const words = str.split('_')
    let res = ''
    for (let i = 0; i < words.length - 1; i++) {
      res += capitalizeFirstLetter(words[i])
      if (i == 0) {
        res += ' '
      }
    }
    return res
  }

  const romanToInt = {
      'I': 1,
      'II': 2,
      'III': 3,
      'IV': 4,
  }

  axios.get(
    `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`,
    { 
      headers: { 
        'X-Riot-Token': process.env.RIOT_API_KEY
      } 
    }
  )
    .then(res => {
      res.data.forEach(el => (
        summonerRankedData[extractQueueType(el.queueType)] = {
          tier: capitalizeFirstLetter(el.tier),
          rank: romanToInt[el.rank],
          LP: el.leaguePoints,
          wins: el.wins,
          losses: el.losses,
          winrate: (el.wins / (el.wins + el.losses) * 100).toFixed(2),
          totalGames: el.wins + el.losses,
        }
      ))
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.send(summonerRankedData)
   });
})

// get summoner match ids list
app.get('/api/match-ids/:puuid', (req, res) => {
  let puuid = req.params.puuid;
  let data = {}
  axios.get(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
    { 
      headers: { 
        'X-Riot-Token': process.env.RIOT_API_KEY
      } 
    }
  )
    .then(res => {
      data = res.data;
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.status(200).json(data)
    });  
})

// get match info
app.get('/api/match/:matchId', (req, res) => {
  let matchId = req.params.matchId
  let data = {}
  axios.get(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    { 
      headers: { 
        'X-Riot-Token': process.env.RIOT_API_KEY
      } 
    }
  )
    .then(res => {
      data = res.data
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.status(200).json(data)
    });
})

// get list of match info for all match ids 
// TODO: add optional param for numMatches
app.get('/api/match-list/:puuid', async (req, res) => {
  try {
    const puuid = req.params.puuid
    //const numMatches = req.params.numMatches
  
    const matchIdsRes = await axios.get(`/api/match-ids/${puuid}`)
    // const matchInfoRes = await Promise.all(matchIdsRes.data.map(async (matchId) => 
    //   axios.get(`/api/match/${matchId}`)
    // ))
    res.status(200).json(matchIdsRes)
  } catch(err) {
    //console.log(err);
  }
})

// get match info with v4 api
// TODO: update once v5 api live
app.get('/api/match-list-v4/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId

    const matchIdsRes = await axios.get(
      `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`,
      {headers: { 'X-Riot-Token': process.env.RIOT_API_KEY}}
    )
    const matchIds = matchIdsRes.data.matches.map(el => el.gameId)

    // now get match data for all of these matchids
    // TODO: remove slice once rate limiting figured out
    // const matchList = await Promise.all(matchIds.slice(1, 3).map(async matchId => {
    //   console.log(matchId)
    //   return axios.get(
    //     `https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}`,
    //     {headers: { 'X-Riot-Token': process.env.RIOT_API_KEY}}
    //   )
    // }
     
    // ))


    const matchList = await axios.get(
      `https://na1.api.riotgames.com/lol/match/v4/matches/3963093762`,
      {headers: { 'X-Riot-Token': process.env.RIOT_API_KEY}}
    )

    res.send(matchList)
  } catch(err) {
    console.log(err)
   // console.log(err.response.data)
  }
})

// all other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(
  PORT, 
  () => console.log(`app listening at http://localhost:${PORT}`)
);
