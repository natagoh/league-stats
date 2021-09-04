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

    async function getMatchList() {
      const puuid = profileData.puuid
      const res = await axios.get(`/api/match-ids/${puuid}`)
      const matchIds = res.data
      console.log("matchIds", matchIds)
      let matchList = []
      for (let i = 0; i < matchIds.length; i++) {
        const matchId = matchIds[i]
        const match = await axios.get(`/api/match/${matchId}`)
        matchList.push(match.data)
      }

      console.log("match v5", matchList)

      setMatchList(matchList)     
    }

    getProfileData();
    getRankedData();
    getMatchList()    
  }, [summoner, profileData.summonerId, profileData.puuid, profileData.accountId]);

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
       <MatchHistory matchList={matchList}/>
      </div>
    </div>
  )
}
