import React from 'react'

import './SummonerRank.css'

// LP: 75
// losses: 79
// rank: "III"
// tier: "Silver"
// totalGames: 160
// winrate: "50.63"
// wins: 81
export default function SummonerRank(props) {
  const { queue, data } = props;
  const { LP, losses, rank, tier, totalGames, winrate, wins } = data;

  return (
    <div className="summoner-rank-container">
      <img 
        className="summoner-rank-photo"
        src={require(`./../assets/ranked-emblems/Emblem_${tier}.png`).default}
        alt={`${tier} ranked emblem`}/>
      <div className="summoner-rank-text">
        <p>{queue}</p>
        <p>{`${tier} ${rank} ${LP} LP`}</p>
        <p>{`${wins}W ${losses}L`}</p>
        <p>{`${winrate}% WR ${totalGames} games`}</p>
      </div>
    </div>
  )
}
