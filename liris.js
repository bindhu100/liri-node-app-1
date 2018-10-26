var defaultRequest = require("dotenv").config();
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api')
var fs = require('fs');
var enter = process.argv;
var action = enter[2];
var userInput = enter[3];
var keys = require("./keys.js");

 switch (action) {
	case "concert-this":
	concert(userInput);
	break;

	case "spotify-this-song":
	spotify(userInput);
	break;

	case "movie-this":
	movie(userInput);
	break;

	case "do-what-it-says":
	doit();
	break;
};

function concert(userInput) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";

 request(queryUrl, function(error,response,body){
   var jsonData = JSON.parse(body);
     for(var i in jsonData) {
      temp = jsonData[i].datetime;
      console.log('Artist(s):' + process.argv[3]);
      console.log('Venue Name:' + jsonData[i].venue.name);
      console.log('date: ' + moment(temp).format('DD/MM/YYYY'));
      console.log('City/Country: ' + jsonData[i].venue.city + ', ' + jsonData[i].venue.country)
      console.log('Location : ' + jsonData[i].venue.latitude + ', ' + jsonData[i].venue.longitude);
      console.log('=========================================');
      }
    });
};

function spotify(userInput) {

	var spotify = new Spotify(keys.spotify);

		spotify.search({ type: 'track', query: userInput }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songs = data.tracks.items;
          console.log('=========================================');
	        console.log("Artist(s): " + songs[0].artists[0].name);
	        console.log("Song Name: " + songs[0].name);
	        console.log("Preview Link: " + songs[0].preview_url);
	        console.log("Album: " + songs[0].album.name);
          console.log('=========================================');
	});
}

function movie(userInput) {

	var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=454505b9";

	request(queryUrl, function(error, response, body) {

        var jsonData = JSON.parse(body);
		    console.log("Title: " + jsonData.Title);
		    console.log("Release Year: " + jsonData.Year);
		    console.log("IMDB Rating: " + jsonData.imdbRating);
		    console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
		    console.log("Country: " + jsonData.Country);
		    console.log("Language: " + jsonData.Language);
		    console.log("Plot: " + jsonData.Plot);
		    console.log("Actors: " + jsonData.Actors);
	});
};


function doit() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}
		var dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		} else if (dataArr[0] === "concert-this") {
			var tweetname = dataArr[1].slice(1, -1);
			twitter(tweetname);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		}

  	});

};
