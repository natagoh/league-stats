import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import Search from './Search';
import SummonerProfile from './SummonerProfile';
import SummonerRank from './SummonerRank';
import MatchHistory from './MatchHistory';
import './Stats.css'

export default function Stats() {
  let { summoner } = useParams();
  let [ profileData, setProfileData ] = useState({});
  let [ rankedData, setRankedData ] = useState({});
  let [ matchList, setMatchList ] = useState({});

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

    // TODO: fix hardcoded data once api v5 migrated
    async function getMatchList() {
      //const puuid = profileData.puuid
      const accountId = profileData.accountId;
      //const res = await axios.get(`/api/match-list/${puuid}`)
      const res = await axios.get(`/api/match/${accountId}`)
      setMatchList(res)
     
    }

    getProfileData();
    getRankedData();
    getMatchList()    
  }, [summoner, profileData.summonerId, profileData.puuid, profileData.accountId]);

  const queueOrder = ['Ranked Solo', 'Ranked Flex']

  console.log(matchList)
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
       <MatchHistory matchList={matchList}/>
      </div>
    </div>
  )
}
