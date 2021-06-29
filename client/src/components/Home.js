import React, { useState } from 'react'

import './Home.css'

export default function Home() {
	const [summoner, setSummoner] = useState("");

	const handleChange = (e) => {
		setSummoner(e.target.value)
	};

	const handleClick = () => setSummoner("");

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			console.log(summoner)
		}
	}

	return (
		<div className="home-container">
			<div>
				<p className="home-title">
					League Stats
				</p>
				<input 
					className="home-input"
					type="text"
					onChange={handleChange}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					placeholder="summoner name"
					value={summoner} />
			</div>
		</div>
	)
}
