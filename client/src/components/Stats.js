import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import Search from './Search';
import SummonerProfile from './SummonerProfile';
import SummonerRank from './SummonerRank';
import MatchInfo from './MatchInfo';
import './Stats.css'

export default function Stats() {
  let { summoner } = useParams();
  let [ profileData, setProfileData ] = useState({});
  let [ rankedData, setRankedData ] = useState({});

  useEffect(() => {
    async function getProfileData() {
      const res = await axios.get(`/api/profile/${summoner}`)
      setProfileData(res.data)
    } 

    async function getRankedData() {
      const summonerId = profileData.summonerId
      const res = await axios.get(`/api/profile/ranked/${summonerId}`)
      setRankedData(res.data)     
    }

    getProfileData();
    getRankedData()
    
  }, [summoner, profileData.summonerId]);

  //Object.keys(rankedData);
  const queueOrder = ['Ranked Solo', 'Ranked Flex']

  return (
    <div className="stats-container">
      <div className="stats-navbar">
        <Link to="/" className="stats-navbar-home-link">StormRazr.gg</Link>
        <Search filled={false}/>
			</div>
      <div className="stats-content"> 
        <div className="stats-summoner-overview">
          <SummonerProfile data={profileData}/>
          {
            queueOrder.map((queue, idx) => 
              queue in rankedData
                  ? <SummonerRank 
                      queue={queue}
                      data={rankedData[queue]} 
                      key={`ranked-queue-${idx}`}/>
                  : null
              )
          }
        </div>
        <div className="stats-match-history">
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
          <MatchInfo />
        </div>
      </div>
    </div>
  )
}
