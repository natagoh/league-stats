import React from 'react'
import Search from './Search';

import './Home.css'

export default function Home() {
	return (
		<div className="home-container">
			<div>
				<p className="home-title">
					StormRazr.gg
				</p>
				<Search filled={true}/>
			</div>
		</div>
	)
}
