import React from 'react'
import cx from 'classnames'
import './MatchInfo.css'

export default function MatchInfo() {
  let win = false;
  let placeholder = "http://ddragon.leagueoflegends.com/cdn/11.13.1/img/profileicon/4678.png";
  
  return (
    <div className={cx({
      'match-info-container': true,
      'match-info-win': win,
      'match-info-loss': !win,
    })}>
      <div className='match-info-result'>
        <p><span className='match-info-result-queue'>Ranked Solo</span></p>
        <p>an hour ago</p>
        <p>
          <span className={cx({
            'match-info-result-win': win,
            'match-info-result-loss': !win,
          })}>
            {win ? 'WIN' : 'LOSS'}
          </span> 
          {' '}23:34
        </p>
      </div>
      <div className='match-info-summoner'>
        <img
          className='match-info-summoner-pfp' 
          src={placeholder}/>
        <div className='match-info-summoner-lvl'>
          <span>12</span>
        </div>
        <div className='match-info-summoner-spells'>
          {/* summoners */}
          <img
            src={placeholder}/>
          <img
            src={placeholder}/>
          {/* runes */}
          <img
            src={placeholder}/>
          <img
            src={placeholder}/>
        </div>
      </div>
      <div className='match-info-kda'>
          <p>
            <span className='match-info-kda-data'>
              6/1/12
            </span>
          </p>
          <p>18.00:1 KDA</p>
          <p>67% KP</p>
          <p>34 CS (1.3)</p>
      </div>
      <div className='match-info-items'>
        <div className='match-info-items-set'>
          <img
            src={placeholder}/>
          <img
            src={placeholder}/>
           <img
            src={placeholder}/>
          <img
            src={placeholder}/>
           <img
            src={placeholder}/>
          <img
            src={placeholder}/>
          <img
            src={placeholder}/>
        </div>
        <div className='match-info-items-vision'>
          <p>control wards: 5</p>
        </div>
      </div>
      <div className='match-info-team'>
        {/* your team */}
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>       
        {/* enemy team */}
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>   
        <div>
          <img src={placeholder}/>
          <p>teammate</p>
        </div>       
      </div>
    </div>
  )
}
