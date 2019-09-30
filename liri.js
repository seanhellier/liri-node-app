// REQUIRE NPM STATEMENTS

require('dotenv').config();

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var moment = require('moment');
var axios = require('axios');

// user input functions
exports.spotify = {
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET
};

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

// logic
var pick = function(caseData, functionData) {
	switch (caseData) {
		case 'spotify-song':
			console.log('CASE - SPOTIFY');
			if (functionData.length === 0) {
				getSpotify('The Sign');
			} else {
				getSpotify(functionData);
			}
			break;
		case 'movie':
			console.log('CASE - OMDB');
			if (functionData.length === 0) {
				getMovie('Mr. Nobody');
			} else {
				getMovie(functionData);
			}
			break;
		case 'concert':
			console.log('CASE - CONCERT');
			getBit(functionData);
			break;
		case 'do-this':
			console.log('CASE - GET TEXT FROM FILE');
			makeFile();
			break;
		default:
			console.log('LIRI does not know that');
	}
};

//Spotify, omdb, Bands in town functions

// spotify
var spotify = new Spotify(keys.spotify);

var getArtist = function(artist) {
	return artist.name;
};

var getSpotify = function(songName) {
	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		var songs = data.tracks.items;
		for (var i = 0; i < songs.length; i++) {
			var songText =
				i +
				'\n' +
				'artist(s): ' +
				songs[i].artists.map(getArtist) +
				'\n' +
				'song name: ' +
				songs[i].name +
				'\n' +
				'preview song: ' +
				songs[i].preview_url +
				'\n' +
				'album: ' +
				songs[i].album.name +
				'\n' +
				'-----------------------------------\n';
			console.log(songText);
			appendLog(songText);
		}
	});
};
// end spotify

// ombd
var getMovie = function(movieName) {
	axios
		.get('http://www.omdbapi.com/?apikey=' + keys.omdbKeys.id + '&t=' + movieName + '&y=&plot=short&r=json')
		.then(function(response) {
			var movieData = response.data;
			var movieText =
				'Title: ' +
				movieData.Title +
				'\n' +
				'Year: ' +
				movieData.Year +
				'\n' +
				'Rated: ' +
				movieData.Rated +
				'\n' +
				'IMDB Rating: ' +
				movieData.imdbRating +
				'\n' +
				'Country: ' +
				movieData.Country +
				'\n' +
				'Production: ' +
				movieData.Production +
				'\n' +
				'Language: ' +
				movieData.Language +
				'\n' +
				'Plot: ' +
				movieData.Plot +
				'\n' +
				'Actors: ' +
				movieData.Actors +
				'\n' +
				'Rotten tomatoes rating: ' +
				movieData.Ratings[1]['Value'] +
				'\n' +
				'Awards: ' +
				movieData.Awards +
				'\n' +
				'-----------------------------------\n';
			console.log(movieText);
			appendLog(movieText);
		})
		.catch(function(error) {
			if (error.response) {
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
};
// end omdb

// Bands in Town
var getBit = function(artist) {
	axios
		.get('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=' + keys.bandintownKeys.id)
		.then(function(response) {
			console.log('ARTIST: ' + artist);
			appendLog('ARTIST: ' + artist);
			// console.log(response.data);
			var concerts = response.data;
			for (var i = 0; i < concerts.length; i++) {
				var concertText =
					i +
					'\n' +
					'Venue name: ' +
					concerts[i].venue['name'] +
					'\n' +
					'Venue location: ' +
					concerts[i].venue['city'] +
					', ' +
					concerts[i].venue['country'] +
					'\n' +
					'Event date: ' +
					moment(concerts[i].datetime).format('MM/DD/YYYY') +
					'\n' +
					'-----------------------------------\n';
				console.log(concertText);
				appendLog(concertText);
			} // end for
		})
		.catch(function(error) {
			if (error.response) {
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
};
// end Bands in Town

// RANDOM TEXT FILE PROCESSING ==============

var makeFile = function() {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) throw err;
		var dataArr = data.split(',');
		if (dataArr.length == 2) {
			pick(dataArr[0], dataArr[1]);
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
		}
		appendLog(data);
	});
};

// RUN THIS FUNCTION WITH USER INPUT

// APPEND LOG FILE FUNCTIONS
var appendLog = function(data) {
	var logFile = 'log.txt';
	fs.appendFile(logFile, data, function(err) {
		if (err) {
			console.log(err);
		}
	});
}; // end appendLog function

// PROCESS THE USER'S INPUT ============
runThis(process.argv[2], process.argv.slice(3).join(' '));
