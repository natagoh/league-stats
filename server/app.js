const express = require('express')
const path = require('path')
const axios = require('axios');

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001;

// have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/', (req, res) => {
  axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/StormRazr?api_key=${process.env.RIOT_API_KEY}`)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.send('Hello World!')
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
      res.send(summonerData)
      //let profileIconId	= summonerData.profileIconId
      //res.send(`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/${profileIconId}.png`)
    });  
})

app.get('/api/profile/ranked/:summonerId', (req, res) => {
  let param = req.params.summonerId;
  let summonerRankedData = {};
  let encryptedSummonerId = param;
  axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${process.env.RIOT_API_KEY}`)
    .then(res => {
      res.data.forEach(el => (
        summonerRankedData[el.queueType] = {
          tier: el.tier,
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
  () => console.log(`app listening at http://localhost:${PORT} ${process.env.RIOT_API_KEY}`)
);
