import React from 'react'

import './SummonerProfile.css'

export default function SummonerProfile({ data }) {
  const name = data.name;
  const profileIconId = data.profileIconId;
  const summonerLevel = data.summonerLevel;

  return (
    <div className="summoner-profile-container">
      <div className="summoner-profile-img">
        <img 
          // TODO: programmatically pull latest patch
          src={`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/${profileIconId}.png`}/>
        <div>
          <span>{summonerLevel}</span>
        </div>
      </div>
      <div className="summoner-profile-text">
        <p>{name}</p>
        <p>Ladder Rank: noob</p>
        <div className="summoner-profile-update-btn">
          update
        </div>
      </div>
    </div>
  )
}