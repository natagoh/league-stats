import React from 'react'

import './SummonerProfile.css'

export default function SummonerProfile() {
  let placeholder="http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/4678.png";

  return (
    <div className="summoner-profile-container">
      <img 
        className="summoner-profile-photo"
        src={placeholder}/>
      <div className="summoner-profile-text">
        <p>NoobRazr</p>
        <p>Ladder Rank: noob</p>
        <div className="summoner-profile-update-btn">
          update
        </div>
      </div>
    </div>
  )
}
