const express = require('express')
const axios = require('axios');

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001;

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

app.get('/:summoner', (req, res) => {
  let param = req.params.summoner;
  let summoner_data = {}
  axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${param}?api_key=${process.env.RIOT_API_KEY}`)
    .then(res => {
      summoner_data = res.data;
      let encryptedSummonerId = summoner_data.id;
      axios.get(`https://na1.api.riotgames.com//lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${process.env.RIOT_API_KEY}`)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      res.send('summoner path')
    });  

  

})

app.listen(
  PORT, 
  () => console.log(`app listening at http://localhost:${PORT} ${process.env.RIOT_API_KEY}`)
);