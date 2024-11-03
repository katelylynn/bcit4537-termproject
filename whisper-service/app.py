from flask import Flask, request, jsonify
import os
from modules.utils import transcribe_audio  # Import the transcription function

app = Flask(__name__)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    input_filepath = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(input_filepath)

    # Directly pass the saved file to transcribe_audio
    transcription = transcribe_audio(input_filepath)

    # Print the transcription for verification
    print("Transcription:", transcription)

    # Clean up the uploaded file
    os.remove(input_filepath)

    return jsonify({"transcription": transcription})

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(host='0.0.0.0', port=5001)
