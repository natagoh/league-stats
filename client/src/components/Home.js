import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import Search from './Search';

import './Home.css'

export default function Home() {
	const [summoner, setSummoner] = useState("");
	const history = useHistory();

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
