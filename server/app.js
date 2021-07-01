const express = require('express')
const path = require('path')
const axios = require('axios');

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001;

// have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/test', (req, res) => {
  axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/StormRazr?api_key=${process.env.RIOT_API_KEY}`)
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
  let param = req.params.summoner;
  let summonerData = {}
  axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${param}?api_key=${process.env.RIOT_API_KEY}`)
    .then(res => {
      const data = res.data;
      summonerData = {
        summonerId: data.id,
        accountId: data.accountId,
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
      //let profileIconId	= summonerData.profileIconId
      //res.send(`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/${profileIconId}.png`)
    });  
})

// get summoner ranked data
app.get('/api/profile/ranked/:summonerId', (req, res) => {
  let param = req.params.summonerId;
  let summonerRankedData = {};
  let encryptedSummonerId = param;

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

  axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${process.env.RIOT_API_KEY}`)
    .then(res => {
      res.data.forEach(el => (
        summonerRankedData[extractQueueType(el.queueType)] = {
          tier: capitalizeFirstLetter(el.tier),
          rank: el.rank,
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
      //let profileIconId	= summonerData.profileIconId
      //res.send(`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/${profileIconId}.png`)
    });
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(
  PORT, 
  () => console.log(`app listening at http://localhost:${PORT}`)
);
