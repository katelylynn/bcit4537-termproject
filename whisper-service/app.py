""" Initializes the Flask application for handling transcription requests. """

from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.transcription_controller import handle_transcription_request
from lang.en import Messages, MessageKeys
import os
from dotenv import load_dotenv

load_dotenv()

ROUTER_SERVICE = os.getenv("ROUTER_SERVICE")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ROUTER_SERVICE}})

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = app.make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = ROUTER_SERVICE
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

@app.route('/transcribe', methods=['POST', 'OPTIONS'])
def transcribe():

    try:
        return handle_transcription_request(request)
    except Exception as e:
        return jsonify({"error": Messages.get(MessageKeys.UNEXPECTED_ERROR), "details": str(e)}), 500

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(
        host=os.getenv("FLASK_RUN_HOST", "127.0.0.1"), 
        port=int(os.getenv("FLASK_RUN_PORT", 5002))
    )
