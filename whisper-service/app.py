from flask import Flask, request, jsonify
from modules.utils import transcribe_audio
import os

app = Flask(__name__)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filepath = os.path.join("uploads", "audio.wav")
    file.save(filepath)

    
    transcription = transcribe_audio(filepath)
    os.remove(filepath)
    return jsonify({"transcription": transcription})

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(host='0.0.0.0', port=5001)
