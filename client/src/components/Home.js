import React from 'react'

import './Home.css'

export default function Home() {
	return (
		<div className="home-container">
			<div>
				<p className="home-title">
					League Stats
				</p>
				<input 
					className="home-input"
					type="text"
					value="summoner name"/>
			</div>
		</div>
	)
}
