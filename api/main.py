import os
from flask import (
    Flask,
    render_template,
    request,
    jsonify
)
from flask_cors import (
    CORS
)
import requests
from xml.dom import (
    minidom
)
import json

SPLUNK_API_ACCESS_TOKEN = os.environ.get("SPLUNK_API_ACCESS_TOKEN")
SPLUNK_API_URL = os.environ.get("SPLUNK_API_URL")

if SPLUNK_API_ACCESS_TOKEN is None:
    SPLUNK_API_ACCESS_TOKEN = input("Please enter a valid access token to your Splunk installation:\n")

    if len(SPLUNK_API_ACCESS_TOKEN) == 0:
        raise Exception("An access token is required to start the application.\n")

if SPLUNK_API_URL is None:
    SPLUNK_API_URL = input("Please enter the api url to your Splunk instance:\n")

    if len(SPLUNK_API_URL) == 0:
        raise Exception("A url to a Splunk instance is required.\n")

app = Flask(__name__, template_folder="templates")
cors = CORS(app)
app.config["DEBUG"] = os.environ.get("DEBUG_MODE") or False

headers = {"Authorization": f"Bearer {SPLUNK_API_ACCESS_TOKEN}"}

@app.route('/', methods=['GET'])
def root():
    return render_template("home.html")

@app.errorhandler(404)
def resource_not_found(e):
    return render_template("error-404.html"), 404

@app.route('/api/info', methods=['GET'])
def getServerInstanceInfo():
    response = requests.get(f"{SPLUNK_API_URL}/services/server/info?output_mode=json", headers=headers, verify=False)
    return response.json()

@app.route('/api/search', methods=['POST'])
def createSearchJob():
    searchString = request.form.get("search")

    searchQuery = {
        "adhoc_search_level": "smart",
        "sort_key": "_time",
        "sort_dir": "desc"
    }

    for key in request.form.keys():
        formValue = request.form.get(key)
        if formValue and key != "search":
            searchQuery[key] = formValue
        elif formValue and key == "search":
            searchQuery["search"] = f"search {searchString}"

    if searchQuery["search"]:
        response = requests.post(f"{SPLUNK_API_URL}/services/search/jobs", headers=headers, data=searchQuery, verify=False)
        sidKey = minidom.parseString(response.content).getElementsByTagName('sid')
        if len(sidKey):
            return jsonify({ "sid": sidKey[0].childNodes[0].nodeValue })

    return jsonify({"sid": None})

@app.route('/api/search/details', methods=['GET', 'POST'])
def getSearchJobDetails():
    sid = request.form.get("sid")

    if sid and len(sid):
        response = requests.get(f"{SPLUNK_API_URL}/services/search/jobs/{sid}/?output_mode=json", headers=headers, verify=False)
        searchJobDetails = response.json()["entry"][0]["content"]

        return jsonify({"details": searchJobDetails})

    return jsonify({})

@app.route('/api/search/results', methods=['GET', 'POST'])
def getSearchJobResults():
    sid = request.form.get("sid")
    count = int(request.form.get("count") or 0)
    page = int(request.form.get("page") or 0)

    options = {
        "count": count,
        "offset": 0
    }

    if page > 1:
        options.update({"offset": (count * (page - 1))})

    optionArray = []

    for key in options.keys():
        optionArray.append(f"{key}={options.get(key)}")

    optionString = "&&".join(optionArray)

    if sid and len(sid):
        response = requests.get(f"{SPLUNK_API_URL}/services/search/jobs/{sid}/results?output_mode=json&&{optionString}", headers=headers, data=options, verify=False)
        return jsonify(response.json())

    return jsonify({"results": []})

if __name__ == '__main__':
    try:
        getServerInstanceInfo()
        app.run(host='localhost', port=4000)
    except (requests.ConnectionError, requests.exceptions.MissingSchema) as exception:
        raise Exception("Failed to connect to the Splunk instance, provide a valid access token and url to the instance.")
