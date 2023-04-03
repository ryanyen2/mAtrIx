import time
from flask import Flask
from flask import request

app = Flask(__name__, static_folder='../build', static_url_path='/')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route("/api/updateModelId", methods=["PUT"], strict_slashes=False)
def update_model_id():
    id = request.json
    print("Updated current algorithm id is " + str(id))
    # id = int(id)
    data = {"status": "success"}
    return data, 200

@app.route("/api/updateModelParams", methods=["PUT"], strict_slashes=False)
def update_model_params():
    id = request.json
    print("Model Params " + str(id))
    # id = int(id)
    data = {"status": "success"}
    return data, 200
