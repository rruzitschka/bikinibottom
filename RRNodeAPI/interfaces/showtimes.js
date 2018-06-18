// showtimes API integration
'use strict';

// activate logglevel with DEBUG=app:dev
const devDebug = require('debug')('app:dev');
const request = require('request');
//const debug = require('debug');

// interfaces exported by this module
module.exports = {
  findCinemasByMovie: findCinemasByMovie,
  setLang: setLang
};

// define the default request options
const requestOptions = {
  method: 'GET',
  baseUrl: 'https://api.internationalshowtimes.com/v4',
  uri: '',
  json: true,
  headers: {
    'X-Api-Key' : 'YP4i0j3TlE2LKHsWjRzvBX1CYVDK9ROg' // trial key
  }
}

//############################################
// default values
//############################################
// set the default language
let defaultLang = 'de';
// set the default count of showtimes response
let defaultShowtimesCount = 3;


//############################################
// PUBLIC Functions
//############################################

// set the default language for any query operations
function setLang(lang) {
  defaultLang = lang || 'de';
}


// find cinemas which are currently playing a certain movie 
async function findCinemasByMovie(movie,country,city,dayRange,timeRange) {
  console.log(`findCinemasByMovie() called movie: "${movie}" country: "${country}" city: "${city}"`);
  country = country || 'AT'; // if not set use AT as default value
  // try {
    const foundMovie = await _getMovieID(movie);
    const city_id = await _getCityID(city,country);
    if (foundMovie===undefined || city_id===undefined) {
      return null;
    }
    const cinemas = await _findCinemasPlayMovie(foundMovie.movie_id,city_id,dayRange,timeRange);

    const answer = _createAnswerString(foundMovie.title,cinemas,defaultShowtimesCount);
    console.log(`findCinemasByMovie() returns answer: "${answer}"`);
    return answer;
  // }
  // catch(err) {
  //   console.log('findCinemasByMovie() failed with ',err);
  // }
}

//--------------------------------------------
// PRIVATE Functions
//--------------------------------------------

// find the city ID
async function _getCityID(city,country) {
  let city_id;
  let reqObj = {
    APImethod: 'cities',
    queryStrings: [
      { name: 'limit', value: 1},
      { name: 'query', value: city},
      { name: 'lang', value: defaultLang }
    ]
  };
  if (country) {
    // restrict the search for the given country
    reqObj.queryStrings.push({ name: 'countries', value: country});
  }
  const cities = await _showtimesRequest(reqObj);

  if (cities.meta_info.total_count > 0) {
    city_id=cities.cities[0].id;
  }
  else {
    let err = new Error('The given city was not found!');
    err.HTTPCode=404;
    throw err;
  }
  devDebug('city_id: ',city_id);
  return city_id;
}


// find the showtimes movie ID for a given movie name
async function _getMovieID(movie) {
  let resMovie;
  let reqObj = {
    APImethod: 'movies',
    queryStrings: [
      { name: 'search_query', value: movie},
      { name: 'search_field', value: 'title'},
      { name: 'countries', value: 'AT'}
    ]
  };
  const movies = await _showtimesRequest(reqObj);

  if (movies.meta_info.total_count > 0) {
    // ok: movie found
    resMovie= { 
      movie_id: movies.movies[0].id,
      title: movies.movies[0].title
    };
  }
  else {
    let err = new Error('The given movie was not found!');
    err.HTTPCode=404;
    throw err;
  }
  // const movie_id = getMovieIDfromMoviesResp(movies);
  return resMovie;
}

// fetch cinemas which play the movie with the given ID
async function _findCinemasPlayMovie(movie_id,city_id,dayRange,timeRange) {
  // let cinemas=[]; // return obj
  let timeFrom = new Date(Date.now()) ; // seek from now
  let timeTo = new Date(Date.now() + 6*3600*1000); //  to now + 6 hours
  
  let reqObj = {
    APImethod: 'showtimes',
    queryStrings: [
      { name: 'time_from', value: timeFrom.toISOString() },
      { name: 'time_to', value: timeTo.toISOString() },
      { name: 'movie_id', value: movie_id},
      //{ name: 'countries', value: 'AT' },
      { name: 'city_ids', value: city_id },
      //{ name: 'location', value: '48.210033,16.363449'},
      { name: 'distance', value: '20'},
      { name: 'fields', value: 'cinema_id,start_at'},
      { name: 'append', value: 'cinemas'},
      { name: 'cinema_fields', value: 'id,name,location.address.display_text'} 
    ]
  };
  const body = await _showtimesRequest(reqObj);
  
  // // just return a subset of the cinemas found
  // for (let i=0; i < body.cinemas.length && i<4; i++) {
  //   // return just the list of cinemas
  //   cinemas.push(body.cinemas[i]);
  // }
  return body;
}

// send request to showtimes API - returns Promise
function _showtimesRequest(reqObj) {
  return new Promise( (resolve,reject) => {
    // execute async task
    requestOptions.uri = createUri(reqObj);
    devDebug('requestOptions: ',requestOptions);
    request(requestOptions, (err,resp,body) => {
      let document;
      if (err) {
        console.log('_showtimesRequest - error received: ',err)
        err.HTTPCode = resp.statusCode; // add the HTTP response code to err obj
        reject(err);
      }
      else {
        devDebug('_showTimesRequest: body:',body);
        resolve(body);
      }
    });
  });
}

// fetch movie_id from response of movies API
function getMovieIDfromMoviesResp(movies) {
  if (movies.meta_info.total_count > 0) {
      return movies.movies[0].id;
  }
  else {
      throw new Error('The given movie was not found!');
  }
}

// create the request URL from the request Object
function createUri(reqObj) {
  devDebug(reqObj);
  let uri;
  const validAPImethods = 'movies|cinemas|showtimes|cities';

  if (validAPImethods.includes(reqObj.APImethod))
  { // valid API method
    uri='/' + reqObj.APImethod;
    if (reqObj.queryStrings.length > 0) {
      // add the query parameters
      uri += '?';
      for (let i=0; i < reqObj.queryStrings.length; i++) {
          uri += reqObj.queryStrings[i].name + '=' + encodeURI(reqObj.queryStrings[i].value) + '&';
          // uri += reqObj.queryStrings[i].name + '=' + reqObj.queryStrings[i].value + '&';
      }
      // chop off the last '&' from the uri string
      uri = uri.substr(0,uri.length-1);
    }
    devDebug(uri);
  }
  else {
    console.log('ERROR: createUri() called with invalid APImethod: ',reqObj.APImethod);
  }
  return uri;
}

// create the Answer string with format:
// <Title> wird heute im <Cinema> um <Time> gespielt.
// ...
function _createAnswerString(title,cinemas,count) {
  let response = '';
  let cinema_id, lastCinema_id=0;
  let cinemaName;
  let now = new Date(Date.now());
  let startTime;
  let minutes, day;
  for (let i=0; i < count && i < cinemas.showtimes.length; i++) {
    // fetch the next showtime data
    cinema_id = cinemas.showtimes[i].cinema_id;
    startTime = new Date(cinemas.showtimes[i].start_at);
    devDebug('startTime: ', startTime.getDate());

    // get the 'when' the movie is played
    if ( startTime.getMinutes() == 0 ) {
      // suppress reporting of minutes
      minutes = "";
    }
    else {
      minutes = startTime.getMinutes();
    }
    if (startTime.getDate() === now.getDate()) {
      // heute
      day = ' wird heute ';
    }
    else if ( startTime.getDate() === (now.getDate()+1) ) {
      // morgen
      day = ' wird morgen ';
    }
    else {
      // am XX-ten
      day = ' wird am ' + startTime.getDate() + '.';
    }

    // get 'where' the movie is played
    let found = false;
    let ndx = 0;
    while (!found && ndx < cinemas.cinemas.length) {
      if (cinemas.cinemas[ndx].id === cinema_id ) {
        found = true;
        cinemaName = cinemas.cinemas[ndx].name;
      }
      ndx++;
    }
    
    // stitch together the answer for one 'showtime'
    if ( cinema_id === lastCinema_id) {
      // just add times
      response += ' um ' + startTime.getHours() + ' Uhr '+ minutes; // + ' gespielt.';
    }
    else { // add new cinema to the answer
      if ( response.length == 0) {
        response = title; // add titles as the first element in the answer
      }
      else {
        response += ' gespielt. Oder ';
      }
      response += day + ' im ' + cinemaName + ' um ' + startTime.getHours() + ' Uhr '+ minutes;
    }
    lastCinema_id = cinema_id;
  }
  if (response.length > 0) // so there were added at least one showtime -> terminate the answer!
    response += ' gespielt.';
  return response;
}

