const fs = require('fs');
const google = require('googleapis');
const key = require('../../cal_secret.json');
const jwtClient = new google.auth.JWT(
	key.client_email,
	null,
	key.private_key,
	[
		'https://www.googleapis.com/auth/plus.me',
		'https://www.googleapis.com/auth/calendar.readonly',
	], // an array of auth scopes
	null
);


export function getEvents(cb: Function) {
	jwtClient.authorize(function (err: object, tokens: any) {
		if (err) {
		  console.log(err);
		  return;
		}
		
		listEvents(jwtClient, (events: any) => {
			cb(events);
		});
	});
}

/**
 * Lists the next events on the tiny tattoo calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth: any, cb: Function) {
	var calendar = google.calendar('v3');
	calendar.events.list({
	  auth: auth,
	  calendarId: '8tqjskmh0f61nlg9o6kak73nso@group.calendar.google.com',
	  timeMin: (new Date()).toISOString(),
	  singleEvents: true,
	  orderBy: 'startTime'
	}, function(err: object, response: any) {
	  if (err) {
		console.log('The API returned an error: ' + err);
		return;
	  }
	  var events = response.items;
	  if (events.length == 0) {
		console.log('No upcoming events found.');
	  } else {
		  cb(events);
	  }
	});
  }