let $ = function(id) {
	return document.getElementById(id);
};

// const apiKey = "*********";
import { apiKey } from "../apiKey";
function round(num) {
	return Math.round(num * 100) / 100;
}
function kda(kills, deaths, games) {
	return round((kills - deaths) / games);
}
export async function search() {
	try {
		response = await get($("gamertag").value);
	} finally {
		let stats = response.Results[0].Result;

		let statsObject = {
			Gamertag: stats.PlayerId.Gamertag,
			SR: stats.SpartanRank,
			XP: stats.Xp.toLocaleString("en"),
			KDA: kda(
				stats.ArenaStats.TotalKills,
				stats.ArenaStats.TotalDeaths,
				stats.ArenaStats.TotalGamesCompleted
			),
			Kills: stats.ArenaStats.TotalKills.toLocaleString("en"),
			Deaths: stats.ArenaStats.TotalDeaths.toLocaleString("en"),
			Wins: stats.ArenaStats.TotalGamesWon.toLocaleString("en"),
			Losses: stats.ArenaStats.TotalGamesLost.toLocaleString("en")
		};
		$("stats").textContent = "";
		Object.keys(statsObject).forEach(function(key) {
			$("stats").insertAdjacentHTML(
				"beforeend",
				`<p>${key}: ${statsObject[key]}</p>`
			);
		});
	}
}

async function get(gamertag) {
	return new Promise(function(resolve, reject) {
		fetch(
			`https://www.haloapi.com/stats/h5/servicerecords/arena?players=${gamertag}&=`,
			{
				method: "GET",
				headers: {
					"ocp-apim-subscription-key": apiKey
				}
			}
		)
			.then(response => {
				console.log(response);
				if (response.ok) {
					// if HTTP-status is 200-299
					// get the response body (the method explained below)
					let json = response.json();
					resolve(json);
				} else {
					alert("HTTP-Error: " + response.status);
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
}
