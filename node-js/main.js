/*
	Copyright (C) 2022  Soheil Khodayari, CISPA
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.


	Description:
	------------
	The main program that runs the node.js sanitizor testing pipeline


	Usage:
	------------
	$ node main.js --input=/path/to/input/markups/file --output=/path/to/output/file

*/

const fs = require('fs');
const pathModule = require('path');
const argv = require("process.argv");
const express = require('express');
const bodyParser = require('body-parser');

const DEBUG = false;


// https://github.com/bevacqua/insane
const insaneSanitizer = require('insane');

// https://github.com/ecto/bleach
const bleachSanitizer = require('bleach');

// https://www.npmjs.com/package/html-purify
const yahooHTMLPurifySanitizerClass = require('html-purify');
const yahooPurifySanitizer = new yahooHTMLPurifySanitizerClass();


// https://docs.angularjs.org/api/ngSanitize/service/$sanitize
// https://github.com/angular/universal/issues/830
// mocks angularjs lib in node
const mockAngularInNode = true;


const arcgisSanitizerClass = require("@esri/arcgis-html-sanitizer").Sanitizer;
const arcgisSanitizer = new arcgisSanitizerClass();

/**
 * ------------------------------------------------
 *  			utility functions
 * ------------------------------------------------
**/


/** 
 * @function readFile 
 * @param file_path_name: absolute path of a file.
 * @return the text content of the given file if it exists, otherwise -1.
**/
function readFile(file_path_name){
	try {
		const data = fs.readFileSync(file_path_name, 'utf8')
		return data;
	} catch (err) {
		// console.error(err)
		return -1;
	}
}



/**
 * ------------------------------------------------
 *  			Sanitizers
 * ------------------------------------------------
**/


function sanitizeWithInsane(payload, mode){

	let options = insaneSanitizer.defaults;
	
	if(mode === 'strict'){
		options = {
			allowedTags: []
		};
	}

	let output = insaneSanitizer(payload, options)
	return output;

}



function sanitizeWithBleach(payload, mode){
	
	let output = '';
	if(mode === 'strict'){
		output= bleachSanitizer.sanitize(payload)
	}
	else{
		let options =  { mode: 'black', list: [] };
		output= bleachSanitizer.sanitize(payload, options);
	}

	return  output;

}


function sanitizeWithYahooPurifier(payload){
	return yahooPurifySanitizer.purify(payload);
}

function sanitizeWithArcgis(payload){
	return arcgisSanitizer.sanitize(payload);
}


const app = express();

app.use(bodyParser.json());

app.post('/sanitize', (req, res) => {
	const markups = req.body.markups;
	const sanitizerResults = {
		'insane-default': [],
		'insane-strict': [],
		'bleach-default': [],
		'bleach-strict': [],
		'angular': [],
		'arcgis': [],
		'yahoopurify': []
	};

	for (let i = 0; i < markups.length; i++) {
		const payload = markups[i];

		// insane sanitizer
		let output = sanitizeWithInsane(payload);
		sanitizerResults['insane-default'].push({
			input: payload,
			output: output
		});
		output = sanitizeWithInsane(payload, 'strict');
		sanitizerResults['insane-strict'].push({
			input: payload,
			output: output
		});

		// bleach sanitizer
		output = sanitizeWithBleach(payload);
		sanitizerResults['bleach-default'].push({
			input: payload,
			output: output
		});
		output = sanitizeWithBleach(payload, 'strict');
		sanitizerResults['bleach-strict'].push({
			input: payload,
			output: output
		});

		// angular in node
		if (mockAngularInNode) {
			// calls ngSanitize.$sanitize(html) 
			document.getElementById('sanitization-input').value = payload;
			// read the output
			output = document.getElementById('sanitization-output').innerHTML;
			sanitizerResults['angular'].push({
				input: payload,
				output: output
			});
		}

		// yahoo purify
		output = sanitizeWithYahooPurifier(payload);
		sanitizerResults['yahoopurify'].push({
			input: payload,
			output: output
		});

		// arcgis
		output = sanitizeWithArcgis(payload);
		sanitizerResults['arcgis'].push({
			input: payload,
			output: output
		});
	}

	res.json(sanitizerResults);
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
function main(){

	
	if(mockAngularInNode){
		// angular initialization
		let HTML_TEMPLATE = `<!DOCTYPE html>
		<html>
		<body>
			 <div ng-app="myApp" ng-controller="myCtrl">
				<textarea id="sanitization-input" ng-model="markup"></textarea>
				<span id="sanitization-output" ng-bind-html="markup"> </span>
			 </div>
		</body>
		</html>`


		// jsdom
		const jsdom = require("jsdom");
		const { JSDOM } = jsdom;
		const dom = new JSDOM(HTML_TEMPLATE);
		var win = dom.window;
		var doc = win.document;

		// mock
		global['window'] = win;
		global['document'] = doc;
		global['navigator'] = win.navigator;

		// not implemented property and functions
		// see: https://github.com/angular/universal/issues/830
		Object.defineProperty(win.document.body.style, 'transform', {
			value: () => {
				return {
					enumerable: true,
					configurable: true,
				};
			},
		});
		// othres mock
		global['CSS'] = null;
		// global['WebSocket'] = require('ws');
		// global['XMLHttpRequest'] = require('xhr2');
		global['Prism'] = null;


		// https://www.npmjs.com/package/angular-sanitize
		require('./deps/angularjs');
		const angularSanitizer = require('./deps/angular-sanitize');



		// angular
		var app = window.angular.module('myApp', ['ngSanitize']);
		app.controller('myCtrl', function($scope) { });
	}

}

/*
* entry point
*/
(function(){

	try{ 
		main() 
	}catch(ex){
		DEBUG && console.log(e);
	}
 
})();







