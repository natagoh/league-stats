import React, { useState }  from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHistory } from "react-router-dom";

import SummonerProfile from './SummonerProfile';
import SummonerRank from './SummonerRank';
import MatchInfo from './MatchInfo';
import './Stats.css'

export default function Stats() {
  const [summoner, setSummoner] = useState("");
  const history = useHistory();

  let { username } = useParams();

  const handleChange = (e) => {
		setSummoner(e.target.value)
	};

	const handleClick = () => setSummoner("");

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			console.log(summoner)
			history.push(`/summoner/${summoner}`)
		}
	}

  return (
    <div className="stats-container">
      <div className="stats-navbar">
        <Link to="/" className="stats-navbar-home-link">League Stats</Link>
        {/* TODO: decompose input into component */}
        <input 
					className="stats-navbar-input"
					type="text"
					onChange={handleChange}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					placeholder="summoner name"
					value={summoner} />
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
