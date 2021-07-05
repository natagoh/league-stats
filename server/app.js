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
    {headers: { 'X-Riot-Token': process.env.RIOT_API_KEY}}
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
      //console.log(err);
    })
    .then(() => {
      res.send(summonerRankedData)
   });
})

// get summoner match ids list
// TODO: devapi -> riot api once v5 is live, change hard coded data to real
app.get('/api/match-ids/:puuid', (req, res) => {
  let puuid = req.params.puuid;
  // let data = {}
  // axios.get(`https://na1.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${process.env.DEV_KEY}`)
  //   .then(res => {
  //     data = res.data;
  //   })
  //   .catch(err => {
  //     //console.log(err);
  //   })
  //   .then(() => {
  //     res.status(200).json(data)
  //   });  
  res.status(200).send([
    "NA1_3963178176",
    "NA1_3963126590",
    "NA1_3963093762",
    "NA1_3962670468",
    "NA1_3962635522",
    "NA1_3962630424",
    "NA1_3960750534",
    "NA1_3960657776",
    "NA1_3960374813",
    "NA1_3960402007",
    "NA1_3960278501",
    "NA1_3960285026",
    "NA1_3960310788",
    "NA1_3960226704",
    "NA1_3960222823",
    "NA1_3960192807",
    "NA1_3960101096",
    "NA1_3959835667",
    "NA1_3959277401",
    "NA1_3959263861"
])
})

// get match info
// TODO: hardcoded
app.get('/api/match/:matchId', (req, res) => {
  let matchId = req.params.matchId
  // let data = {}
  // //axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`)
  // axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/NA1_3960750534`)
  //   .then(res => {
  //     data = res.data
  //   })
  //   .catch(err => {
  //     //console.log(err);
  //   })
  //   .then(() => {
  //     res.status(200).json(data)
  //   });
  
  res.status(200).send(
    {
      "metadata": {
          "dataVersion": "2",
          "matchId": "NA1_3963178176",
          "participants": [
              "JCB8mJZHvq8lYfSiEJeym2j4kCvUaIkMCLZ2I-BfprN1CvC5nsvo1MYSzLny3T-qUhx_xlvrxmTpXQ",
              "M1fjfc7F7MTyTGfXT8Xs4BRRFrQ0m5xR0MW13JG1CcN38rWepRAg4uPEJbGG2x5Q6M8wmavKjR3JYw",
              "s6zR_4be4lC7n-JJ10I6smoyU_oKOlWSquwje_pyeSnODNxx-2mO-XnJsEbwf95g_V2smhnR1Z3UlQ",
              "BUDH9OvF-tP8wRXcdKnTKgZwEeUixa5aYExjzhF1NqkTj-MvTPA9BJFiyglFH6hryNaU940X2zwvmw",
              "CbJL5VI9-Bl6TaG4v8IlXavP9PIHQf6N74HnVKBwQ8-y75bBnsC5FwcPlcLXavpVMROVjhdTNu57_Q",
              "5PHZIhuqp2lijRkcGYlsv3MrjONhBWGZr7WmGfTmJ6vFMJeeitoRAtP-PeYGdXI9qmmopqLH95prvw",
              "o7il7aZunbYOjQ_Acd4u5R0g8CDkI9xHz7evWFaD1GbkVjpdo-a0bEDNibmBtyptNpBgZpnoje7HCg",
              "nMB-KVDDAYkPA2kdYlh0N2BrVS79dRYcJm658PeRN7k1-MKPL8MLCQOE_9i3s0RnIe0-o4RJXnKypg",
              "iULnYwCyNC_RRFwdPbFd71HLLKehRWjO7m9mCg3l2z6cIwtM9GAKM0-MCXVaHHkCYZ_Poym8zqejEg",
              "CHWu4nRvEjPB62-ki_0KTpuONuku9X6w179R_E2g85PEd0kWSknUbt13NQekY7dnYC9fX_lL44PuiA"
          ]
      },
      "info": {
          "gameCreation": 1625176059000,
          "gameDuration": 2003226,
          "gameId": 3963178176,
          "gameMode": "CLASSIC",
          "gameName": "teambuilder-match-3963178176",
          "gameStartTimestamp": 1625176184645,
          "gameType": "MATCHED_GAME",
          "gameVersion": "11.13.382.1241",
          "mapId": 11,
          "participants": [
              {
                  "assists": 14,
                  "baronKills": 0,
                  "bountyLevel": 1,
                  "champExperience": 17598,
                  "champLevel": 17,
                  "championId": 83,
                  "championName": "Yorick",
                  "championTransform": 0,
                  "consumablesPurchased": 0,
                  "damageDealtToBuildings": 8224,
                  "damageDealtToObjectives": 16804,
                  "damageDealtToTurrets": 8224,
                  "damageSelfMitigated": 27743,
                  "deaths": 6,
                  "detectorWardsPlaced": 0,
                  "doubleKills": 1,
                  "dragonKills": 1,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 13024,
                  "goldSpent": 11900,
                  "individualPosition": "TOP",
                  "inhibitorKills": 2,
                  "inhibitorTakedowns": 2,
                  "inhibitorsLost": 1,
                  "item0": 1028,
                  "item1": 3047,
                  "item2": 8001,
                  "item3": 3076,
                  "item4": 3748,
                  "item5": 6632,
                  "item6": 3340,
                  "itemsPurchased": 22,
                  "killingSprees": 1,
                  "kills": 5,
                  "lane": "TOP",
                  "largestCriticalStrike": 2,
                  "largestKillingSpree": 3,
                  "largestMultiKill": 2,
                  "longestTimeSpentLiving": 352,
                  "magicDamageDealt": 26363,
                  "magicDamageDealtToChampions": 6544,
                  "magicDamageTaken": 10904,
                  "neutralMinionsKilled": 8,
                  "nexusKills": 1,
                  "nexusLost": 0,
                  "nexusTakedowns": 1,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 1,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5005
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8437,
                                      "var1": 1120,
                                      "var2": 774,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8446,
                                      "var1": 2653,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8444,
                                      "var1": 1521,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8451,
                                      "var1": 265,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8400
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 9103,
                                      "var1": 26,
                                      "var2": 30,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8299,
                                      "var1": 590,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          }
                      ]
                  },
                  "physicalDamageDealt": 121191,
                  "physicalDamageDealtToChampions": 10192,
                  "physicalDamageTaken": 19511,
                  "profileIcon": 3584,
                  "puuid": "JCB8mJZHvq8lYfSiEJeym2j4kCvUaIkMCLZ2I-BfprN1CvC5nsvo1MYSzLny3T-qUhx_xlvrxmTpXQ",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "SOLO",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 144,
                  "spell2Casts": 21,
                  "spell3Casts": 35,
                  "spell4Casts": 6,
                  "summoner1Casts": 5,
                  "summoner1Id": 12,
                  "summoner2Casts": 5,
                  "summoner2Id": 4,
                  "summonerId": "-jz8urP4Aq_Y79ayViKR9cDJ69q9hD19Q6ChBtChf6vLzO4",
                  "summonerLevel": 292,
                  "summonerName": "wsn",
                  "teamEarlySurrendered": false,
                  "teamId": 100,
                  "teamPosition": "TOP",
                  "timeCCingOthers": 6,
                  "timePlayed": 1994,
                  "totalDamageDealt": 147733,
                  "totalDamageDealtToChampions": 16815,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 34325,
                  "totalHeal": 6423,
                  "totalHealsOnTeammates": 0,
                  "totalMinionsKilled": 177,
                  "totalTimeCCDealt": 90,
                  "totalTimeSpentDead": 185,
                  "totalUnitsHealed": 1,
                  "tripleKills": 0,
                  "trueDamageDealt": 178,
                  "trueDamageDealtToChampions": 78,
                  "trueDamageTaken": 3910,
                  "turretKills": 3,
                  "turretTakedowns": 5,
                  "turretsLost": 5,
                  "unrealKills": 0,
                  "visionScore": 7,
                  "visionWardsBoughtInGame": 0,
                  "wardsKilled": 1,
                  "wardsPlaced": 5,
                  "win": true
              },
              {
                  "assists": 22,
                  "baronKills": 0,
                  "bountyLevel": 2,
                  "champExperience": 15010,
                  "champLevel": 16,
                  "championId": 154,
                  "championName": "Zac",
                  "championTransform": 0,
                  "consumablesPurchased": 1,
                  "damageDealtToBuildings": 500,
                  "damageDealtToObjectives": 14607,
                  "damageDealtToTurrets": 500,
                  "damageSelfMitigated": 34491,
                  "deaths": 5,
                  "detectorWardsPlaced": 1,
                  "doubleKills": 0,
                  "dragonKills": 1,
                  "firstBloodAssist": true,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 11885,
                  "goldSpent": 10875,
                  "individualPosition": "JUNGLE",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 2,
                  "inhibitorsLost": 1,
                  "item0": 3068,
                  "item1": 3083,
                  "item2": 3047,
                  "item3": 3075,
                  "item4": 1029,
                  "item5": 0,
                  "item6": 3340,
                  "itemsPurchased": 18,
                  "killingSprees": 2,
                  "kills": 7,
                  "lane": "JUNGLE",
                  "largestCriticalStrike": 17,
                  "largestKillingSpree": 3,
                  "largestMultiKill": 1,
                  "longestTimeSpentLiving": 549,
                  "magicDamageDealt": 92064,
                  "magicDamageDealtToChampions": 15226,
                  "magicDamageTaken": 13575,
                  "neutralMinionsKilled": 74,
                  "nexusKills": 0,
                  "nexusLost": 0,
                  "nexusTakedowns": 1,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 2,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5001,
                          "flex": 5008,
                          "offense": 5008
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8439,
                                      "var1": 1231,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8463,
                                      "var1": 1221,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8429,
                                      "var1": 63,
                                      "var2": 21,
                                      "var3": 13
                                  },
                                  {
                                      "perk": 8453,
                                      "var1": 3487,
                                      "var2": 581,
                                      "var3": 0
                                  }
                              ],
                              "style": 8400
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8210,
                                      "var1": 18,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8236,
                                      "var1": 48,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8200
                          }
                      ]
                  },
                  "physicalDamageDealt": 14251,
                  "physicalDamageDealtToChampions": 1239,
                  "physicalDamageTaken": 17344,
                  "profileIcon": 4863,
                  "puuid": "M1fjfc7F7MTyTGfXT8Xs4BRRFrQ0m5xR0MW13JG1CcN38rWepRAg4uPEJbGG2x5Q6M8wmavKjR3JYw",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "NONE",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 70,
                  "spell2Casts": 151,
                  "spell3Casts": 76,
                  "spell4Casts": 8,
                  "summoner1Casts": 20,
                  "summoner1Id": 11,
                  "summoner2Casts": 4,
                  "summoner2Id": 12,
                  "summonerId": "iRVy9IYePF4yj3Bp5i9VCpBIy_TMBhCxQdfBpzpOf8rFUhQ",
                  "summonerLevel": 95,
                  "summonerName": "NinjaDragonYe",
                  "teamEarlySurrendered": false,
                  "teamId": 100,
                  "teamPosition": "JUNGLE",
                  "timeCCingOthers": 50,
                  "timePlayed": 1994,
                  "totalDamageDealt": 119335,
                  "totalDamageDealtToChampions": 17577,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 38743,
                  "totalHeal": 36398,
                  "totalHealsOnTeammates": 956,
                  "totalMinionsKilled": 52,
                  "totalTimeCCDealt": 495,
                  "totalTimeSpentDead": 155,
                  "totalUnitsHealed": 5,
                  "tripleKills": 0,
                  "trueDamageDealt": 13018,
                  "trueDamageDealtToChampions": 1110,
                  "trueDamageTaken": 7823,
                  "turretKills": 0,
                  "turretTakedowns": 3,
                  "turretsLost": 5,
                  "unrealKills": 0,
                  "visionScore": 22,
                  "visionWardsBoughtInGame": 1,
                  "wardsKilled": 3,
                  "wardsPlaced": 9,
                  "win": true
              },
              {
                  "assists": 12,
                  "baronKills": 0,
                  "bountyLevel": 0,
                  "champExperience": 17037,
                  "champLevel": 17,
                  "championId": 875,
                  "championName": "Sett",
                  "championTransform": 0,
                  "consumablesPurchased": 1,
                  "damageDealtToBuildings": 17265,
                  "damageDealtToObjectives": 25796,
                  "damageDealtToTurrets": 17265,
                  "damageSelfMitigated": 32338,
                  "deaths": 5,
                  "detectorWardsPlaced": 0,
                  "doubleKills": 2,
                  "dragonKills": 1,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": true,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 17689,
                  "goldSpent": 15713,
                  "individualPosition": "MIDDLE",
                  "inhibitorKills": 1,
                  "inhibitorTakedowns": 2,
                  "inhibitorsLost": 1,
                  "item0": 3078,
                  "item1": 6035,
                  "item2": 3153,
                  "item3": 3006,
                  "item4": 3074,
                  "item5": 3044,
                  "item6": 3340,
                  "itemsPurchased": 20,
                  "killingSprees": 1,
                  "kills": 13,
                  "lane": "MIDDLE",
                  "largestCriticalStrike": 0,
                  "largestKillingSpree": 10,
                  "largestMultiKill": 4,
                  "longestTimeSpentLiving": 829,
                  "magicDamageDealt": 1272,
                  "magicDamageDealtToChampions": 863,
                  "magicDamageTaken": 15612,
                  "neutralMinionsKilled": 24,
                  "nexusKills": 0,
                  "nexusLost": 0,
                  "nexusTakedowns": 0,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 3,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5005
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8010,
                                      "var1": 487,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9111,
                                      "var1": 2564,
                                      "var2": 500,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9104,
                                      "var1": 16,
                                      "var2": 20,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8299,
                                      "var1": 1267,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8444,
                                      "var1": 1763,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8453,
                                      "var1": 1345,
                                      "var2": 1481,
                                      "var3": 0
                                  }
                              ],
                              "style": 8400
                          }
                      ]
                  },
                  "physicalDamageDealt": 185882,
                  "physicalDamageDealtToChampions": 21596,
                  "physicalDamageTaken": 18480,
                  "profileIcon": 4777,
                  "puuid": "s6zR_4be4lC7n-JJ10I6smoyU_oKOlWSquwje_pyeSnODNxx-2mO-XnJsEbwf95g_V2smhnR1Z3UlQ",
                  "quadraKills": 1,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "SOLO",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 94,
                  "spell2Casts": 32,
                  "spell3Casts": 54,
                  "spell4Casts": 10,
                  "summoner1Casts": 5,
                  "summoner1Id": 4,
                  "summoner2Casts": 5,
                  "summoner2Id": 14,
                  "summonerId": "nnvvyxg_JHJHo_jo9J6TV9aCWmaIqllVjKXWhmA6WOFi7C0",
                  "summonerLevel": 317,
                  "summonerName": "Ozzz",
                  "teamEarlySurrendered": false,
                  "teamId": 100,
                  "teamPosition": "MIDDLE",
                  "timeCCingOthers": 25,
                  "timePlayed": 1994,
                  "totalDamageDealt": 199220,
                  "totalDamageDealtToChampions": 27637,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 37768,
                  "totalHeal": 6501,
                  "totalHealsOnTeammates": 0,
                  "totalMinionsKilled": 180,
                  "totalTimeCCDealt": 199,
                  "totalTimeSpentDead": 135,
                  "totalUnitsHealed": 1,
                  "tripleKills": 2,
                  "trueDamageDealt": 12065,
                  "trueDamageDealtToChampions": 5178,
                  "trueDamageTaken": 3675,
                  "turretKills": 6,
                  "turretTakedowns": 7,
                  "turretsLost": 5,
                  "unrealKills": 0,
                  "visionScore": 31,
                  "visionWardsBoughtInGame": 0,
                  "wardsKilled": 7,
                  "wardsPlaced": 11,
                  "win": true
              },
              {
                  "assists": 8,
                  "baronKills": 0,
                  "bountyLevel": 1,
                  "champExperience": 14485,
                  "champLevel": 15,
                  "championId": 81,
                  "championName": "Ezreal",
                  "championTransform": 0,
                  "consumablesPurchased": 2,
                  "damageDealtToBuildings": 5607,
                  "damageDealtToObjectives": 9900,
                  "damageDealtToTurrets": 5607,
                  "damageSelfMitigated": 14088,
                  "deaths": 9,
                  "detectorWardsPlaced": 1,
                  "doubleKills": 0,
                  "dragonKills": 0,
                  "firstBloodAssist": true,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 13508,
                  "goldSpent": 12375,
                  "individualPosition": "BOTTOM",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 1,
                  "inhibitorsLost": 1,
                  "item0": 3133,
                  "item1": 3077,
                  "item2": 3042,
                  "item3": 6632,
                  "item4": 3158,
                  "item5": 3110,
                  "item6": 3363,
                  "itemsPurchased": 25,
                  "killingSprees": 2,
                  "kills": 7,
                  "lane": "BOTTOM",
                  "largestCriticalStrike": 0,
                  "largestKillingSpree": 2,
                  "largestMultiKill": 1,
                  "longestTimeSpentLiving": 668,
                  "magicDamageDealt": 16994,
                  "magicDamageDealtToChampions": 5304,
                  "magicDamageTaken": 8181,
                  "neutralMinionsKilled": 36,
                  "nexusKills": 0,
                  "nexusLost": 0,
                  "nexusTakedowns": 1,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 4,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5005
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8005,
                                      "var1": 1625,
                                      "var2": 1066,
                                      "var3": 558
                                  },
                                  {
                                      "perk": 9111,
                                      "var1": 840,
                                      "var2": 300,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9103,
                                      "var1": 21,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8017,
                                      "var1": 58,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8304,
                                      "var1": 9,
                                      "var2": 4,
                                      "var3": 5
                                  },
                                  {
                                      "perk": 8347,
                                      "var1": 0,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8300
                          }
                      ]
                  },
                  "physicalDamageDealt": 147157,
                  "physicalDamageDealtToChampions": 16794,
                  "physicalDamageTaken": 17282,
                  "profileIcon": 7,
                  "puuid": "BUDH9OvF-tP8wRXcdKnTKgZwEeUixa5aYExjzhF1NqkTj-MvTPA9BJFiyglFH6hryNaU940X2zwvmw",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "CARRY",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 257,
                  "spell2Casts": 30,
                  "spell3Casts": 37,
                  "spell4Casts": 10,
                  "summoner1Casts": 3,
                  "summoner1Id": 12,
                  "summoner2Casts": 5,
                  "summoner2Id": 4,
                  "summonerId": "DwbCm9CrKr0NwqwJuPOROFB_bfsVR1AZ2ZkjkNGOhxQkInM",
                  "summonerLevel": 163,
                  "summonerName": "OGGifted",
                  "teamEarlySurrendered": false,
                  "teamId": 100,
                  "teamPosition": "BOTTOM",
                  "timeCCingOthers": 3,
                  "timePlayed": 1994,
                  "totalDamageDealt": 168313,
                  "totalDamageDealtToChampions": 22557,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 30163,
                  "totalHeal": 2660,
                  "totalHealsOnTeammates": 0,
                  "totalMinionsKilled": 182,
                  "totalTimeCCDealt": 316,
                  "totalTimeSpentDead": 339,
                  "totalUnitsHealed": 1,
                  "tripleKills": 0,
                  "trueDamageDealt": 4162,
                  "trueDamageDealtToChampions": 458,
                  "trueDamageTaken": 4698,
                  "turretKills": 1,
                  "turretTakedowns": 5,
                  "turretsLost": 5,
                  "unrealKills": 0,
                  "visionScore": 33,
                  "visionWardsBoughtInGame": 1,
                  "wardsKilled": 3,
                  "wardsPlaced": 9,
                  "win": true
              },
              {
                  "assists": 20,
                  "baronKills": 0,
                  "bountyLevel": 3,
                  "champExperience": 13609,
                  "champLevel": 15,
                  "championId": 37,
                  "championName": "Sona",
                  "championTransform": 0,
                  "consumablesPurchased": 6,
                  "damageDealtToBuildings": 1828,
                  "damageDealtToObjectives": 3776,
                  "damageDealtToTurrets": 1828,
                  "damageSelfMitigated": 11243,
                  "deaths": 8,
                  "detectorWardsPlaced": 3,
                  "doubleKills": 1,
                  "dragonKills": 0,
                  "firstBloodAssist": false,
                  "firstBloodKill": true,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 11769,
                  "goldSpent": 10450,
                  "individualPosition": "UTILITY",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 2,
                  "inhibitorsLost": 1,
                  "item0": 6616,
                  "item1": 2065,
                  "item2": 2055,
                  "item3": 3158,
                  "item4": 3041,
                  "item5": 3011,
                  "item6": 3364,
                  "itemsPurchased": 24,
                  "killingSprees": 4,
                  "kills": 10,
                  "lane": "BOTTOM",
                  "largestCriticalStrike": 0,
                  "largestKillingSpree": 3,
                  "largestMultiKill": 3,
                  "longestTimeSpentLiving": 641,
                  "magicDamageDealt": 32950,
                  "magicDamageDealtToChampions": 15160,
                  "magicDamageTaken": 9643,
                  "neutralMinionsKilled": 0,
                  "nexusKills": 0,
                  "nexusLost": 0,
                  "nexusTakedowns": 1,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 5,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5008
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8214,
                                      "var1": 1056,
                                      "var2": 4161,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8226,
                                      "var1": 250,
                                      "var2": 813,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8210,
                                      "var1": 12,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8236,
                                      "var1": 48,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8200
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8009,
                                      "var1": 4608,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9105,
                                      "var1": 17,
                                      "var2": 50,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          }
                      ]
                  },
                  "physicalDamageDealt": 6460,
                  "physicalDamageDealtToChampions": 2535,
                  "physicalDamageTaken": 10369,
                  "profileIcon": 4678,
                  "puuid": "CbJL5VI9-Bl6TaG4v8IlXavP9PIHQf6N74HnVKBwQ8-y75bBnsC5FwcPlcLXavpVMROVjhdTNu57_Q",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "SUPPORT",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 102,
                  "spell2Casts": 83,
                  "spell3Casts": 81,
                  "spell4Casts": 13,
                  "summoner1Casts": 8,
                  "summoner1Id": 14,
                  "summoner2Casts": 0,
                  "summoner2Id": 4,
                  "summonerId": "aNOft5Vh4EG7ewYt0tHHr59kuVG4lNffIkfw-c0azkxNsWmb",
                  "summonerLevel": 252,
                  "summonerName": "StormRazr",
                  "teamEarlySurrendered": false,
                  "teamId": 100,
                  "teamPosition": "UTILITY",
                  "timeCCingOthers": 18,
                  "timePlayed": 1994,
                  "totalDamageDealt": 41404,
                  "totalDamageDealtToChampions": 19535,
                  "totalDamageShieldedOnTeammates": 9362,
                  "totalDamageTaken": 21856,
                  "totalHeal": 11803,
                  "totalHealsOnTeammates": 7209,
                  "totalMinionsKilled": 22,
                  "totalTimeCCDealt": 46,
                  "totalTimeSpentDead": 266,
                  "totalUnitsHealed": 5,
                  "tripleKills": 1,
                  "trueDamageDealt": 1992,
                  "trueDamageDealtToChampions": 1838,
                  "trueDamageTaken": 1843,
                  "turretKills": 1,
                  "turretTakedowns": 6,
                  "turretsLost": 5,
                  "unrealKills": 0,
                  "visionScore": 63,
                  "visionWardsBoughtInGame": 4,
                  "wardsKilled": 5,
                  "wardsPlaced": 22,
                  "win": true
              },
              {
                  "assists": 2,
                  "baronKills": 0,
                  "bountyLevel": 0,
                  "champExperience": 16737,
                  "champLevel": 17,
                  "championId": 39,
                  "championName": "Irelia",
                  "championTransform": 0,
                  "consumablesPurchased": 1,
                  "damageDealtToBuildings": 2666,
                  "damageDealtToObjectives": 5874,
                  "damageDealtToTurrets": 2666,
                  "damageSelfMitigated": 29090,
                  "deaths": 9,
                  "detectorWardsPlaced": 1,
                  "doubleKills": 0,
                  "dragonKills": 0,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 14071,
                  "goldSpent": 13975,
                  "individualPosition": "TOP",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 0,
                  "inhibitorsLost": 3,
                  "item0": 3047,
                  "item1": 6333,
                  "item2": 3153,
                  "item3": 6673,
                  "item4": 6609,
                  "item5": 0,
                  "item6": 3364,
                  "itemsPurchased": 25,
                  "killingSprees": 2,
                  "kills": 9,
                  "lane": "TOP",
                  "largestCriticalStrike": 552,
                  "largestKillingSpree": 2,
                  "largestMultiKill": 1,
                  "longestTimeSpentLiving": 684,
                  "magicDamageDealt": 23057,
                  "magicDamageDealtToChampions": 6968,
                  "magicDamageTaken": 11421,
                  "neutralMinionsKilled": 8,
                  "nexusKills": 0,
                  "nexusLost": 1,
                  "nexusTakedowns": 0,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 6,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5005
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8010,
                                      "var1": 551,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9111,
                                      "var1": 646,
                                      "var2": 220,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9104,
                                      "var1": 18,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8014,
                                      "var1": 588,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8143,
                                      "var1": 733,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8135,
                                      "var1": 1966,
                                      "var2": 4,
                                      "var3": 0
                                  }
                              ],
                              "style": 8100
                          }
                      ]
                  },
                  "physicalDamageDealt": 141832,
                  "physicalDamageDealtToChampions": 17028,
                  "physicalDamageTaken": 16843,
                  "profileIcon": 4652,
                  "puuid": "5PHZIhuqp2lijRkcGYlsv3MrjONhBWGZr7WmGfTmJ6vFMJeeitoRAtP-PeYGdXI9qmmopqLH95prvw",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "SOLO",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 222,
                  "spell2Casts": 23,
                  "spell3Casts": 70,
                  "spell4Casts": 9,
                  "summoner1Casts": 4,
                  "summoner1Id": 12,
                  "summoner2Casts": 5,
                  "summoner2Id": 4,
                  "summonerId": "3zIUCkyRE4F1YvsgoCkGA4tNPfFbDwtjEbLZzKtKGXARaAI",
                  "summonerLevel": 155,
                  "summonerName": "iForeCheck",
                  "teamEarlySurrendered": false,
                  "teamId": 200,
                  "teamPosition": "TOP",
                  "timeCCingOthers": 23,
                  "timePlayed": 1994,
                  "totalDamageDealt": 166707,
                  "totalDamageDealtToChampions": 25181,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 31886,
                  "totalHeal": 4133,
                  "totalHealsOnTeammates": 0,
                  "totalMinionsKilled": 209,
                  "totalTimeCCDealt": 133,
                  "totalTimeSpentDead": 324,
                  "totalUnitsHealed": 1,
                  "tripleKills": 0,
                  "trueDamageDealt": 1816,
                  "trueDamageDealtToChampions": 1184,
                  "trueDamageTaken": 3621,
                  "turretKills": 2,
                  "turretTakedowns": 2,
                  "turretsLost": 11,
                  "unrealKills": 0,
                  "visionScore": 9,
                  "visionWardsBoughtInGame": 1,
                  "wardsKilled": 0,
                  "wardsPlaced": 2,
                  "win": false
              },
              {
                  "assists": 11,
                  "baronKills": 0,
                  "bountyLevel": 0,
                  "champExperience": 13663,
                  "champLevel": 15,
                  "championId": 25,
                  "championName": "Morgana",
                  "championTransform": 0,
                  "consumablesPurchased": 7,
                  "damageDealtToBuildings": 152,
                  "damageDealtToObjectives": 19071,
                  "damageDealtToTurrets": 152,
                  "damageSelfMitigated": 21418,
                  "deaths": 9,
                  "detectorWardsPlaced": 6,
                  "doubleKills": 0,
                  "dragonKills": 1,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 10953,
                  "goldSpent": 9625,
                  "individualPosition": "JUNGLE",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 0,
                  "inhibitorsLost": 3,
                  "item0": 3157,
                  "item1": 3916,
                  "item2": 2055,
                  "item3": 1011,
                  "item4": 3020,
                  "item5": 4633,
                  "item6": 3364,
                  "itemsPurchased": 25,
                  "killingSprees": 0,
                  "kills": 3,
                  "lane": "JUNGLE",
                  "largestCriticalStrike": 0,
                  "largestKillingSpree": 0,
                  "largestMultiKill": 1,
                  "longestTimeSpentLiving": 485,
                  "magicDamageDealt": 117806,
                  "magicDamageDealtToChampions": 14178,
                  "magicDamageTaken": 10589,
                  "neutralMinionsKilled": 120,
                  "nexusKills": 0,
                  "nexusLost": 1,
                  "nexusTakedowns": 0,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 7,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5008
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8128,
                                      "var1": 1140,
                                      "var2": 17,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8126,
                                      "var1": 644,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8138,
                                      "var1": 30,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8105,
                                      "var1": 13,
                                      "var2": 5,
                                      "var3": 0
                                  }
                              ],
                              "style": 8100
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8210,
                                      "var1": 10,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8232,
                                      "var1": 5,
                                      "var2": 30,
                                      "var3": 0
                                  }
                              ],
                              "style": 8200
                          }
                      ]
                  },
                  "physicalDamageDealt": 18013,
                  "physicalDamageDealtToChampions": 866,
                  "physicalDamageTaken": 22831,
                  "profileIcon": 1375,
                  "puuid": "o7il7aZunbYOjQ_Acd4u5R0g8CDkI9xHz7evWFaD1GbkVjpdo-a0bEDNibmBtyptNpBgZpnoje7HCg",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "NONE",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 101,
                  "spell2Casts": 140,
                  "spell3Casts": 23,
                  "spell4Casts": 10,
                  "summoner1Casts": 20,
                  "summoner1Id": 11,
                  "summoner2Casts": 5,
                  "summoner2Id": 4,
                  "summonerId": "hSBY8Bk7rpDfFZh0QNFc1BEJdwkh_uvRb0dGTB5RYEmm1Jg",
                  "summonerLevel": 65,
                  "summonerName": "mutedK",
                  "teamEarlySurrendered": false,
                  "teamId": 200,
                  "teamPosition": "JUNGLE",
                  "timeCCingOthers": 68,
                  "timePlayed": 1994,
                  "totalDamageDealt": 157584,
                  "totalDamageDealtToChampions": 16658,
                  "totalDamageShieldedOnTeammates": 452,
                  "totalDamageTaken": 34802,
                  "totalHeal": 12236,
                  "totalHealsOnTeammates": 0,
                  "totalMinionsKilled": 45,
                  "totalTimeCCDealt": 303,
                  "totalTimeSpentDead": 274,
                  "totalUnitsHealed": 1,
                  "tripleKills": 0,
                  "trueDamageDealt": 21764,
                  "trueDamageDealtToChampions": 1612,
                  "trueDamageTaken": 1382,
                  "turretKills": 0,
                  "turretTakedowns": 0,
                  "turretsLost": 11,
                  "unrealKills": 0,
                  "visionScore": 28,
                  "visionWardsBoughtInGame": 8,
                  "wardsKilled": 3,
                  "wardsPlaced": 9,
                  "win": false
              },
              {
                  "assists": 7,
                  "baronKills": 0,
                  "bountyLevel": 0,
                  "champExperience": 14261,
                  "champLevel": 15,
                  "championId": 45,
                  "championName": "Veigar",
                  "championTransform": 0,
                  "consumablesPurchased": 7,
                  "damageDealtToBuildings": 6791,
                  "damageDealtToObjectives": 8771,
                  "damageDealtToTurrets": 6791,
                  "damageSelfMitigated": 11448,
                  "deaths": 7,
                  "detectorWardsPlaced": 4,
                  "doubleKills": 1,
                  "dragonKills": 0,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 12215,
                  "goldSpent": 11850,
                  "individualPosition": "MIDDLE",
                  "inhibitorKills": 1,
                  "inhibitorTakedowns": 1,
                  "inhibitorsLost": 3,
                  "item0": 6656,
                  "item1": 3157,
                  "item2": 3089,
                  "item3": 3020,
                  "item4": 0,
                  "item5": 1082,
                  "item6": 3363,
                  "itemsPurchased": 27,
                  "killingSprees": 2,
                  "kills": 6,
                  "lane": "MIDDLE",
                  "largestCriticalStrike": 0,
                  "largestKillingSpree": 4,
                  "largestMultiKill": 2,
                  "longestTimeSpentLiving": 505,
                  "magicDamageDealt": 178190,
                  "magicDamageDealtToChampions": 23978,
                  "magicDamageTaken": 7619,
                  "neutralMinionsKilled": 12,
                  "nexusKills": 0,
                  "nexusLost": 1,
                  "nexusTakedowns": 0,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 8,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5008
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8112,
                                      "var1": 1512,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8126,
                                      "var1": 474,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8120,
                                      "var1": 3,
                                      "var2": 18,
                                      "var3": 6
                                  },
                                  {
                                      "perk": 8106,
                                      "var1": 5,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8100
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8304,
                                      "var1": 9,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8347,
                                      "var1": 0,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8300
                          }
                      ]
                  },
                  "physicalDamageDealt": 7525,
                  "physicalDamageDealtToChampions": 1255,
                  "physicalDamageTaken": 10823,
                  "profileIcon": 4571,
                  "puuid": "nMB-KVDDAYkPA2kdYlh0N2BrVS79dRYcJm658PeRN7k1-MKPL8MLCQOE_9i3s0RnIe0-o4RJXnKypg",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "SOLO",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 141,
                  "spell2Casts": 95,
                  "spell3Casts": 29,
                  "spell4Casts": 8,
                  "summoner1Casts": 6,
                  "summoner1Id": 14,
                  "summoner2Casts": 4,
                  "summoner2Id": 4,
                  "summonerId": "_7yXu6MGRZUGMDQctmPEhIL4oCoh5uwonw-OQT7sM-rwvS4",
                  "summonerLevel": 91,
                  "summonerName": "iHypnosz",
                  "teamEarlySurrendered": false,
                  "teamId": 200,
                  "teamPosition": "MIDDLE",
                  "timeCCingOthers": 53,
                  "timePlayed": 1994,
                  "totalDamageDealt": 196284,
                  "totalDamageDealtToChampions": 27396,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 19805,
                  "totalHeal": 839,
                  "totalHealsOnTeammates": 0,
                  "totalMinionsKilled": 172,
                  "totalTimeCCDealt": 174,
                  "totalTimeSpentDead": 187,
                  "totalUnitsHealed": 1,
                  "tripleKills": 0,
                  "trueDamageDealt": 10568,
                  "trueDamageDealtToChampions": 2162,
                  "trueDamageTaken": 1362,
                  "turretKills": 1,
                  "turretTakedowns": 2,
                  "turretsLost": 11,
                  "unrealKills": 0,
                  "visionScore": 42,
                  "visionWardsBoughtInGame": 4,
                  "wardsKilled": 1,
                  "wardsPlaced": 14,
                  "win": false
              },
              {
                  "assists": 6,
                  "baronKills": 1,
                  "bountyLevel": 0,
                  "champExperience": 14477,
                  "champLevel": 15,
                  "championId": 67,
                  "championName": "Vayne",
                  "championTransform": 0,
                  "consumablesPurchased": 1,
                  "damageDealtToBuildings": 4342,
                  "damageDealtToObjectives": 14346,
                  "damageDealtToTurrets": 4342,
                  "damageSelfMitigated": 18965,
                  "deaths": 10,
                  "detectorWardsPlaced": 0,
                  "doubleKills": 2,
                  "dragonKills": 0,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 15372,
                  "goldSpent": 14550,
                  "individualPosition": "BOTTOM",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 1,
                  "inhibitorsLost": 3,
                  "item0": 3031,
                  "item1": 3072,
                  "item2": 6672,
                  "item3": 3006,
                  "item4": 3046,
                  "item5": 0,
                  "item6": 3340,
                  "itemsPurchased": 19,
                  "killingSprees": 5,
                  "kills": 14,
                  "lane": "BOTTOM",
                  "largestCriticalStrike": 652,
                  "largestKillingSpree": 3,
                  "largestMultiKill": 2,
                  "longestTimeSpentLiving": 431,
                  "magicDamageDealt": 911,
                  "magicDamageDealtToChampions": 318,
                  "magicDamageTaken": 10939,
                  "neutralMinionsKilled": 8,
                  "nexusKills": 0,
                  "nexusLost": 1,
                  "nexusTakedowns": 0,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 9,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5005
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8005,
                                      "var1": 2444,
                                      "var2": 1540,
                                      "var3": 904
                                  },
                                  {
                                      "perk": 9111,
                                      "var1": 600,
                                      "var2": 400,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 9104,
                                      "var1": 19,
                                      "var2": 20,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8014,
                                      "var1": 871,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8139,
                                      "var1": 1512,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8135,
                                      "var1": 2658,
                                      "var2": 5,
                                      "var3": 0
                                  }
                              ],
                              "style": 8100
                          }
                      ]
                  },
                  "physicalDamageDealt": 128950,
                  "physicalDamageDealtToChampions": 28213,
                  "physicalDamageTaken": 17738,
                  "profileIcon": 4867,
                  "puuid": "iULnYwCyNC_RRFwdPbFd71HLLKehRWjO7m9mCg3l2z6cIwtM9GAKM0-MCXVaHHkCYZ_Poym8zqejEg",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "CARRY",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 104,
                  "spell2Casts": 0,
                  "spell3Casts": 18,
                  "spell4Casts": 11,
                  "summoner1Casts": 5,
                  "summoner1Id": 4,
                  "summoner2Casts": 4,
                  "summoner2Id": 7,
                  "summonerId": "GPHnCVuBBNQtcWDNQpxWyaTXnNE_TgEfh3HTQmhwXDDvfZY",
                  "summonerLevel": 196,
                  "summonerName": "Tadoe Cpr",
                  "teamEarlySurrendered": false,
                  "teamId": 200,
                  "teamPosition": "BOTTOM",
                  "timeCCingOthers": 14,
                  "timePlayed": 1994,
                  "totalDamageDealt": 164831,
                  "totalDamageDealtToChampions": 44618,
                  "totalDamageShieldedOnTeammates": 0,
                  "totalDamageTaken": 30805,
                  "totalHeal": 6067,
                  "totalHealsOnTeammates": 301,
                  "totalMinionsKilled": 162,
                  "totalTimeCCDealt": 24,
                  "totalTimeSpentDead": 339,
                  "totalUnitsHealed": 3,
                  "tripleKills": 0,
                  "trueDamageDealt": 34969,
                  "trueDamageDealtToChampions": 16086,
                  "trueDamageTaken": 2127,
                  "turretKills": 2,
                  "turretTakedowns": 4,
                  "turretsLost": 11,
                  "unrealKills": 0,
                  "visionScore": 21,
                  "visionWardsBoughtInGame": 0,
                  "wardsKilled": 6,
                  "wardsPlaced": 10,
                  "win": false
              },
              {
                  "assists": 17,
                  "baronKills": 0,
                  "bountyLevel": 0,
                  "champExperience": 12995,
                  "champLevel": 14,
                  "championId": 350,
                  "championName": "Yuumi",
                  "championTransform": 0,
                  "consumablesPurchased": 5,
                  "damageDealtToBuildings": 819,
                  "damageDealtToObjectives": 927,
                  "damageDealtToTurrets": 819,
                  "damageSelfMitigated": 11827,
                  "deaths": 7,
                  "detectorWardsPlaced": 5,
                  "doubleKills": 0,
                  "dragonKills": 0,
                  "firstBloodAssist": false,
                  "firstBloodKill": false,
                  "firstTowerAssist": false,
                  "firstTowerKill": false,
                  "gameEndedInEarlySurrender": false,
                  "gameEndedInSurrender": false,
                  "goldEarned": 9014,
                  "goldSpent": 8675,
                  "individualPosition": "UTILITY",
                  "inhibitorKills": 0,
                  "inhibitorTakedowns": 1,
                  "inhibitorsLost": 3,
                  "item0": 3853,
                  "item1": 6617,
                  "item2": 3504,
                  "item3": 6616,
                  "item4": 3114,
                  "item5": 0,
                  "item6": 3364,
                  "itemsPurchased": 24,
                  "killingSprees": 0,
                  "kills": 1,
                  "lane": "BOTTOM",
                  "largestCriticalStrike": 0,
                  "largestKillingSpree": 0,
                  "largestMultiKill": 1,
                  "longestTimeSpentLiving": 491,
                  "magicDamageDealt": 17658,
                  "magicDamageDealtToChampions": 10018,
                  "magicDamageTaken": 5176,
                  "neutralMinionsKilled": 0,
                  "nexusKills": 0,
                  "nexusLost": 1,
                  "nexusTakedowns": 0,
                  "objectivesStolen": 0,
                  "objectivesStolenAssists": 0,
                  "participantId": 10,
                  "pentaKills": 0,
                  "perks": {
                      "statPerks": {
                          "defense": 5002,
                          "flex": 5008,
                          "offense": 5008
                      },
                      "styles": [
                          {
                              "description": "primaryStyle",
                              "selections": [
                                  {
                                      "perk": 8214,
                                      "var1": 1750,
                                      "var2": 2343,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8226,
                                      "var1": 250,
                                      "var2": 765,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8210,
                                      "var1": 4,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8236,
                                      "var1": 48,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8200
                          },
                          {
                              "description": "subStyle",
                              "selections": [
                                  {
                                      "perk": 8009,
                                      "var1": 3361,
                                      "var2": 0,
                                      "var3": 0
                                  },
                                  {
                                      "perk": 8017,
                                      "var1": 974,
                                      "var2": 0,
                                      "var3": 0
                                  }
                              ],
                              "style": 8000
                          }
                      ]
                  },
                  "physicalDamageDealt": 2520,
                  "physicalDamageDealtToChampions": 1825,
                  "physicalDamageTaken": 9332,
                  "profileIcon": 1597,
                  "puuid": "CHWu4nRvEjPB62-ki_0KTpuONuku9X6w179R_E2g85PEd0kWSknUbt13NQekY7dnYC9fX_lL44PuiA",
                  "quadraKills": 0,
                  "riotIdName": "",
                  "riotIdTagline": "",
                  "role": "SUPPORT",
                  "sightWardsBoughtInGame": 0,
                  "spell1Casts": 48,
                  "spell2Casts": 126,
                  "spell3Casts": 85,
                  "spell4Casts": 11,
                  "summoner1Casts": 6,
                  "summoner1Id": 14,
                  "summoner2Casts": 7,
                  "summoner2Id": 3,
                  "summonerId": "Cct8so1_KaVLApOXlOpNks00TY0pFSvP0Maqver7B7s47A4",
                  "summonerLevel": 513,
                  "summonerName": "scary cat murder",
                  "teamEarlySurrendered": false,
                  "teamId": 200,
                  "teamPosition": "UTILITY",
                  "timeCCingOthers": 20,
                  "timePlayed": 1994,
                  "totalDamageDealt": 20916,
                  "totalDamageDealtToChampions": 12581,
                  "totalDamageShieldedOnTeammates": 4695,
                  "totalDamageTaken": 14927,
                  "totalHeal": 16216,
                  "totalHealsOnTeammates": 13582,
                  "totalMinionsKilled": 6,
                  "totalTimeCCDealt": 51,
                  "totalTimeSpentDead": 251,
                  "totalUnitsHealed": 5,
                  "tripleKills": 0,
                  "trueDamageDealt": 738,
                  "trueDamageDealtToChampions": 738,
                  "trueDamageTaken": 418,
                  "turretKills": 0,
                  "turretTakedowns": 4,
                  "turretsLost": 11,
                  "unrealKills": 0,
                  "visionScore": 37,
                  "visionWardsBoughtInGame": 5,
                  "wardsKilled": 0,
                  "wardsPlaced": 23,
                  "win": false
              }
          ],
          "platformId": "NA1",
          "queueId": 420,
          "teams": [
              {
                  "bans": [
                      {
                          "championId": 53,
                          "pickTurn": 1
                      },
                      {
                          "championId": 11,
                          "pickTurn": 2
                      },
                      {
                          "championId": 236,
                          "pickTurn": 3
                      },
                      {
                          "championId": 777,
                          "pickTurn": 4
                      },
                      {
                          "championId": 10,
                          "pickTurn": 5
                      }
                  ],
                  "objectives": {
                      "baron": {
                          "first": false,
                          "kills": 0
                      },
                      "champion": {
                          "first": true,
                          "kills": 42
                      },
                      "dragon": {
                          "first": false,
                          "kills": 3
                      },
                      "inhibitor": {
                          "first": false,
                          "kills": 3
                      },
                      "riftHerald": {
                          "first": false,
                          "kills": 0
                      },
                      "tower": {
                          "first": true,
                          "kills": 11
                      }
                  },
                  "teamId": 100,
                  "win": true
              },
              {
                  "bans": [
                      {
                          "championId": 24,
                          "pickTurn": 6
                      },
                      {
                          "championId": 141,
                          "pickTurn": 7
                      },
                      {
                          "championId": 360,
                          "pickTurn": 8
                      },
                      {
                          "championId": 75,
                          "pickTurn": 9
                      },
                      {
                          "championId": 36,
                          "pickTurn": 10
                      }
                  ],
                  "objectives": {
                      "baron": {
                          "first": true,
                          "kills": 1
                      },
                      "champion": {
                          "first": false,
                          "kills": 33
                      },
                      "dragon": {
                          "first": true,
                          "kills": 1
                      },
                      "inhibitor": {
                          "first": true,
                          "kills": 1
                      },
                      "riftHerald": {
                          "first": true,
                          "kills": 1
                      },
                      "tower": {
                          "first": false,
                          "kills": 5
                      }
                  },
                  "teamId": 200,
                  "win": false
              }
          ],
          "tournamentCode": ""
      }
  }
  )
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
