import React from 'react'
import MatchInfo from './MatchInfo'

import './MatchHistory.css'

export default function MatchHistory({matchList}) {
  
  return (
    <div className="match-history">
      <MatchInfo match={matchList.data}/>
    </div>
  )
}
