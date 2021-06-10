import os
from flask import (
    Flask,
    render_template,
    request,
    jsonify
)
import requests
from xml.dom import (
    minidom
)

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
    searchString = request.form.get("searchString")

    if searchString and len(searchString):
        searchQuery = { "search": "search " + searchString }
        response = requests.post(f"{SPLUNK_API_URL}/services/search/jobs", headers=headers, data=searchQuery, verify=False)
        sid = minidom.parseString(response.content).getElementsByTagName('sid')[0].childNodes[0].nodeValue
        return jsonify({ "sid": sid })

    return jsonify({"sid": None})

@app.route('/api/search', methods=['GET'])
def getSearchJobStatus():
    sid = request.form.get("sid")

    if sid and len(sid):
        response = requests.get(f"{SPLUNK_API_URL}/services/search/jobs/{sid}/?output_mode=json", headers=headers, verify=False)
        searchJobStatus = response.json()["entry"][0]["content"]["dispatchState"]

        return jsonify({"status": searchJobStatus})

    return jsonify({"status": None})

@app.route('/api/search/results', methods=['GET'])
def getSearchJobResults():
    sid = request.form.get("sid")

    if sid and len(sid):
        response = requests.get(f"{SPLUNK_API_URL}/services/search/jobs/{sid}/results?output_mode=json&count=0", headers=headers, verify=False)
        return jsonify(response.json())

    return jsonify({"results": []})

if __name__ == '__main__':
    try:
        getServerInstanceInfo()
        app.run(host='localhost', port=4000)
    except (requests.ConnectionError, requests.exceptions.MissingSchema) as exception:
        raise Exception("Failed to connect to the Splunk instance, provide a valid access token and url to the instance.")
