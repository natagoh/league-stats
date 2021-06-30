import React from 'react'

import './ImgDetail.css'

export default function ImgDetail() {
  return (
    <div className="img-detail-container">
      <img 
        className="img-detail-photo"
        src="http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/4678.png"/>
      <div className="img-detail-text">
        <p>username</p>
        <p>Ladder Rank: noob</p>
      </div>
    </div>
  )
}
