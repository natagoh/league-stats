import React from 'react'

import './SummonerRank.css'

import Iron from './../assets/ranked-emblems/Emblem_Iron.png';
import Bronze from './../assets/ranked-emblems/Emblem_Bronze.png';
import Silver from './../assets/ranked-emblems/Emblem_Silver.png';
import Gold from './../assets/ranked-emblems/Emblem_Gold.png';
import Platinum from './../assets/ranked-emblems/Emblem_Platinum.png';
import Diamond from './../assets/ranked-emblems/Emblem_Diamond.png';
import Master from './../assets/ranked-emblems/Emblem_Master.png';
import Grandmaster from './../assets/ranked-emblems/Emblem_Grandmaster.png';
import Challenger from './../assets/ranked-emblems/Emblem_Challenger.png';


export default function SummonerRank() {
  return (
    <div className="summoner-rank-container">
      <img 
        className="summoner-rank-photo"
        src={Gold}/>
      <div className="summoner-rank-text">
        <p>Ranked Solo</p>
        <p>Silver II &middot; 27 LP</p>
        <p>20W 20L</p>
        <p>50.00% WR 40 games</p>
      </div>
    </div>
  )
}
