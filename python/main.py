# -*- coding: utf-8 -*-

"""
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
	The main program that runs the python sanitizor testing pipeline


	Usage:
	------------
	$ python3 main.py --input=/path/to/input/markups/file --output=/path/to/output/file

"""

import argparse
import os, sys
import json

# sanitizers
import bleach

# setup a mock django app
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoapp.settings")
import django
django.setup()

# django html sanitizer
# see: https://github.com/ui/django-html_sanitizer/blob/master/sanitizer/tests.py
from sanitizer.templatetags.sanitizer import (sanitize as django_sanitize, sanitize_allow,
    escape_html, strip_filter, strip_html)

from django.conf import settings
from flask import Flask, request, jsonify



app = Flask(__name__)

@app.route('/sanitize', methods=['POST'])
def sanitize():
	markups = request.json.get('markups')
	
	results = {
		'bleach': [],
		'django-html-sanitizer': [],
		'django-html-escape': []
	}

	
	for markup in markups:
		payload = markup.strip().rstrip('\n').strip()
		try:
			results['bleach'].append({
				'input': payload,
				'output': bleach.clean(payload)
			})
		except:
			results['bleach'].append({
				'input': payload,
				'output': 'error'
			})
		try:
			results['django-html-sanitizer'].append({
				'input': payload,
				'output': django_sanitize(payload)
			})
		except:
			results['django-html-sanitizer'].append({
				'input': payload,
				'output': 'error'
			})
		try:
			results['django-html-escape'].append({
				'input': payload,
				'output': escape_html(payload, allowed_tags=settings.SANITIZER_ALLOWED_TAGS, allowed_attributes=settings.SANITIZER_ALLOWED_ATTRIBUTES, allowed_styles=settings.SANITIZER_ALLOWED_STYLES)
			})
		except:
			results['django-html-escape'].append({
				'input': payload,
				'output': 'error'
			})
	
	return jsonify(results)

if __name__ == '__main__':
	app.run(host="0.0.0.0",port=3001)