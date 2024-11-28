from flask import Flask, send_from_directory, request, jsonify
import os
import requests

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_from_directory('./', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return "File not found", 404

@app.route('/sanitize', methods=['POST'])
def sanitize():
    data = request.json
    markups = data.get('markups', [])

    # Send requests to other containers
    php_response = requests.post('http://php:80/', json={'markups': markups})
    python_response = requests.post('http://python:3001/sanitize', json={'markups': markups})
    nodejs_response = requests.post('http://nodejs:3000/sanitize', json={'markups': markups})

    # Combine results
    results = {
        'php': php_response.json(),
        'python': python_response.json(),
        'nodejs': nodejs_response.json()
    }

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3003)
