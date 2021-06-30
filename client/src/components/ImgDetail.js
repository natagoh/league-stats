import React from 'react'

import './ImgDetail.css'

import Iron from './../assets/ranked-emblems/Emblem_Iron.png';
import Bronze from './../assets/ranked-emblems/Emblem_Bronze.png';
import Silver from './../assets/ranked-emblems/Emblem_Silver.png';
import Gold from './../assets/ranked-emblems/Emblem_Gold.png';
import Platinum from './../assets/ranked-emblems/Emblem_Platinum.png';
import Diamond from './../assets/ranked-emblems/Emblem_Diamond.png';
import Master from './../assets/ranked-emblems/Emblem_Master.png';
import Grandmaster from './../assets/ranked-emblems/Emblem_Grandmaster.png';
import Challenger from './../assets/ranked-emblems/Emblem_Challenger.png';


export default function ImgDetail() {
  let placeholder="http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/4678.png";

  return (
    <div className="img-detail-container">
      <img 
        className="img-detail-photo"
        src={Gold}/>
      <div className="img-detail-text">
        <p>username</p>
        <p>Ladder Rank: noob</p>
      </div>
    </div>
  )
}
