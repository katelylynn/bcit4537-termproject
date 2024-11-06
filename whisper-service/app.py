from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
from modules.utils import transcribe_audio  # Import the transcription function
import tempfile

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

@app.route('/transcribe', methods=['POST', 'OPTIONS'])
def transcribe():

    # pre-flight
    if request.method == 'OPTIONS':
        # Send an empty response with the appropriate headers
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        # FIRST PRINT TEST
        # return jsonify({"transcription": "This is a test"})

        print("Received request at /transcribe")
        print("Request headers:", request.headers)
        print("Request method:", request.method)

        # Check if 'file' is in the request
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        # file = request.files['file']
        # input_filepath = os.path.join("uploads", file.filename)
        # os.makedirs("uploads", exist_ok=True)
        # file.save(input_filepath)

        file = request.files['file']

        # Save to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_filepath = temp_file.name
            file.save(temp_filepath)
            print(f"File saved to temporary file: {temp_filepath}")

        # Attempt transcription
        transcription = transcribe_audio(temp_filepath)
        
        # Print the transcription for verification
        print("Transcription:", transcription)
        print("Transcription type:", type(transcription))
        print("Transcription value:", transcription)

        # Clean up the uploaded file if necessary
        # os.remove(input_filepath)

        # SECOND PRINT TEST
        # return jsonify({"transcription": "This is a test"})

        response = make_response(jsonify({"transcription": transcription}), 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(host='127.0.0.1', port=5002)