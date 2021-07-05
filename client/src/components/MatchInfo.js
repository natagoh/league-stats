import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import ddragonItem from '../ddragon/item.json'
import ddragonChampion from '../ddragon/champion.json'
import ddragonSummoner from '../ddragon/summoner.json'
import ddragonRunesReforged from '../ddragon/runesReforged.json'

import './MatchInfo.css'

export default function MatchInfo({ match }) {
  let [ matchData, setMatchData ] = useState({})

  // console.log(match)
  let placeholder = "http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/4678.png";
  
  useEffect(() => {
    if (match !== undefined) {
      const players = match.info.participants;
      // extract your data
      // TODO: feed player name as prop
      const data = players.filter(player => player.summonerName === 'StormRazr')
      // console.log(data[0])
      setMatchData(data[0])
    }
    
  }, [match]);


  console.log(matchData)

  // game length
  const gameLengthSeconds = matchData.timePlayed;
  const gameLength = `${~~(gameLengthSeconds / 60)}:${~~gameLengthSeconds % 60}`;
  
  // win or lose
  const win = matchData.win;

  // champ
  let champId = matchData.championName;
  for (let key in ddragonChampion.data) {
    if (ddragonChampion.data[key].name === champId) {
      champId = ddragonChampion.data[key].id
      break
    }
  } 
  const champLevel = matchData.champLevel;

  // summoners + runes
  function getSummonerSpellImgSrc(id) {
    for (let key in ddragonSummoner.data) {
      if (ddragonSummoner.data[key].key == id) {
        return ddragonSummoner.data[key].image.full
      }
    } 
  }

  function getRunePrimaryImgSrc(id) {
    for (let key in ddragonRunesReforged) {
      const runeTree = ddragonRunesReforged[key];
      for (let keyStone in runeTree.slots[0].runes) {
        const runeKeyStone = runeTree.slots[0].runes[keyStone]
        if (runeKeyStone.id === id) {
          return runeKeyStone.icon
        }
      }
    }
  }

  function getRuneSecondaryTreeImgSrc(id) {
    for (let key in ddragonRunesReforged) {
      const runeTree = ddragonRunesReforged[key];
      if (runeTree.id === id) {
        return runeTree.icon
      }
    }
  }

  const summonerSpell1 = getSummonerSpellImgSrc(matchData.summoner1Id)
  const summonerSpell2 = getSummonerSpellImgSrc(matchData.summoner2Id)

  const runeData = matchData?.perks
  const runePrimary = getRunePrimaryImgSrc(runeData?.styles[0]?.selections[0]?.perk)
  const runeSecondaryTree = getRuneSecondaryTreeImgSrc(runeData?.styles[1]?.style)

  // KDA data
  const assists = matchData.assists;
  const deaths = matchData.deaths;
  const kills = matchData.kills;
  const kdaRatio = ((kills + assists) / deaths).toFixed(2)

  const creepScore = matchData.totalMinionsKilled;
  const creepScorePerMin = (creepScore / gameLengthSeconds * 60).toFixed(2);
  
  // items
  let itemIds = []
  Object.keys(matchData)
    .filter(key => /item\d/.test(key))
    .forEach(item => itemIds.push(matchData[item]))

  // to ensure trinket is at the correct slot
  const tmp = itemIds[3]
  itemIds[3] = itemIds[6]
  itemIds[6] = tmp

  // vision
  const controlWards = matchData.visionWardsBoughtInGame

  return (
    <div className={cx({
      'match-info-container': true,
      'match-info-win': win,
      'match-info-loss': !win,
    })}>
      <div className='match-info-result'>
        <p>Ranked Solo</p>
        <p>an hour ago</p>
        <p>
          <span className={cx({
            'match-info-result-win': win,
            'match-info-result-loss': !win,
          })}>
            {win ? 'WIN' : 'LOSS'}
          </span> 
          {` ${gameLength}`}
        </p>
      </div>
      <div className='match-info-summoner'>
        <div className='match-info-summoner-img'>
          <img
            src={`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/champion/${champId}.png`}
            alt={champId} />
        </div>
        <div className='match-info-summoner-lvl'>
          <span>{champLevel}</span>
        </div>
        <div className='match-info-summoner-spells'>
          {/* summoners */}
          <img
            src={`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/spell/${summonerSpell1}`}
            alt="summoner-spell-1" />
          <img
            src={`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/spell/${summonerSpell2}`}
            alt="summoner-spell-2" />
          {/* runes */}
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/img/${runePrimary}`}
            alt="rune-primary" />
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/img/${runeSecondaryTree}`}
            alt="rune-secondary" />
        </div>
      </div>
      <div className='match-info-kda'>
          <p>{`${kills}/${deaths}/${assists}`}</p>
          <p>{kdaRatio} KDA</p>
          <p>67% KP</p>
          <p>{`${creepScore} (${creepScorePerMin}) CS`}</p>
      </div>
      <div className='match-info-items'>
        <div className='match-info-items-set'>
          { 
            itemIds.map((itemId, idx) => {
              const itemSrc = `http://ddragon.leagueoflegends.com/cdn/11.13.1/img/item/${itemId}.png`
              return <img src={itemSrc} alt={`item-${idx}`} />
            })
          }
        </div>
        <div className='match-info-items-vision'>
          <p>control wards: {controlWards}</p>
        </div>
      </div>
      <div className='match-info-team'>
        {/* your team */}
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>       
        {/* enemy team */}
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>       
      </div>
    </div>
  )
}
