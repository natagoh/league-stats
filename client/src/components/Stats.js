import React from 'react'
import { Link, useParams } from 'react-router-dom'

import Search from './Search';
import SummonerProfile from './SummonerProfile';
import SummonerRank from './SummonerRank';
import MatchInfo from './MatchInfo';
import './Stats.css'

export default function Stats() {
  let { username } = useParams();
  return (
    <div className="stats-container">
      <div className="stats-navbar">
        <Link to="/" className="stats-navbar-home-link">StormRazr.gg</Link>
        <Search filled={false}/>
			</div>
      <div className="stats-content"> 
        <div className="stats-summoner-overview">
          <SummonerProfile />
          <SummonerRank />
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
