import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import cx from 'classnames'

import './Search.css'

export default function Search(props) {
  const { filled } = props;
  const [summoner, setSummoner] = useState("");
  const history = useHistory();

  const handleChange = (e) => {
		setSummoner(e.target.value)
	};

	const handleClick = () => setSummoner("");

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			history.push(`/summoner/${summoner}`)
		}
	}

  return (
    <input 
      className={cx({
        'search-input-outline': !filled,
        'search-input-filled': filled,
      })}
      type="text"
      onChange={handleChange}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      placeholder="summoner name"
      value={summoner} />
  )
}
